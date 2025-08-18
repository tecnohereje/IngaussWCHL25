import { execSync } from 'child_process';

function pretest(): void {
    // Ensure a clean state by uninstalling the canister code first.
    // The '|| true' prevents the script from failing if the canister isn't installed yet.
    execSync(`dfx canister uninstall-code ingauss-backend-wchl25 || true`, {
        stdio: 'inherit'
    });

    // Deploy the backend canister to prepare it for testing.
    // The 'deploy' command also generates the necessary type bindings.
    execSync(`dfx deploy ingauss-backend-wchl25`, {
        stdio: 'inherit'
    });
}

pretest();