import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor Ingauss {

  // ================== TIPOS DE DATOS ==================

  // Usamos 'opt' para los campos de texto para que las futuras
  // actualizaciones del canister sean seguras y no rompan los datos existentes.
  type UserProfile = {
    var fullName: opt Text;
    var email: opt Text;
    var bio: opt Text;
    var isSearching: opt Bool;
    var shareContactInfo: opt Bool;
    var locations: opt [Text];
    var salaryRange: opt (Nat, Nat);
    var workplaceTags: opt [Text];
    var preferredTimezone: opt Text;
    var social: opt SocialLinks;
  };
  
  type SocialLinks = {
      var linkedin: opt Text;
      var github: opt Text;
      var instagram: opt Text;
      var x: opt Text;
      var additional: opt [Text];
  };

  type UserStats = {
    var level: Nat;
    var experiencePoints: Nat;
  };
  
  type UserAccount = {
    principal: Principal;
    createdAt: Time.Time;
    var profile: UserProfile;
    var stats: UserStats;
  };

  // ================== ALMACENAMIENTO ==================

  private var userAccounts: HashMap.HashMap<Principal, UserAccount> = HashMap.new();

  // ================== FUNCIONES PÚBLICAS ==================
  
  // Función de consulta (rápida, no consume casi cycles) para obtener una cuenta.
  public query func getAccount() : async ?UserAccount {
    let caller = Principal.fromActor(this);
    return userAccounts.get(caller);
  };
  
  // Función de actualización (consume cycles) que crea una cuenta si no existe.
  // Es la primera función que un nuevo usuario llamará.
  public shared(msg) func createOrGetAccount() : async UserAccount {
    let caller = msg.caller;
    let existingAccount = userAccounts.get(caller);

    switch (existingAccount) {
      case (?account) {
        // Si la cuenta ya existe, la devolvemos.
        return account;
      case (null) {
        // Si la cuenta no existe, creamos una nueva con valores por defecto.
        let newAccount: UserAccount = {
          principal = caller;
          createdAt = Time.now();
          profile = {
            fullName = null;
            email = null;
            bio = null;
            isSearching = null;
            shareContactInfo = null;
            locations = null;
            salaryRange = null;
            workplaceTags = null;
            preferredTimezone = null;
            social = null;
          };
          stats = {
            level = 1;
            experiencePoints = 0;
          };
        };
        userAccounts.put(caller, newAccount);
        return newAccount;
      }
    }
  };
}