{
  description = "Flutter 3.13.x";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/23.11";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };
  outputs = { self, nixpkgs, nixpkgs-unstable, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            android_sdk.accept_license = true;
            allowUnfree = true;
          };
        };
        pkgs-unstable = import nixpkgs-unstable {
          inherit system;
          overlays = [ (import rust-overlay) ];
        };
        rust = pkgs-unstable.rust-bin.stable.latest.default.override {
          extensions = [
            "rust-src" # for rust-analyzer
            "rust-analyzer"
            "rustfmt"
          ];
        };

        buildToolsVersion = "34.0.0";
        androidComposition = pkgs.androidenv.composeAndroidPackages {
          buildToolsVersions = [ buildToolsVersion "30.0.3" ];
          platformVersions = [ "34" "28" "33" ];
          abiVersions = [ "armeabi-v7a" "arm64-v8a" ];
        };
        androidSdk = androidComposition.androidsdk;
        commonBuildInputs = with pkgs; [
          # Chore
          just
          parallel
          openapi-generator-cli
        ];
      in {
        # packages."server" = pkgs.writeShellApplication {
        #   name = "yausma-server";
        #   runtimeInputs = [
        #     pkgs.your-server-pkg # Replace with your server package (e.g., `pkgs.nodejs`, `pkgs.python3`, etc.)
        #   ];

        #   text = ''
        #     echo "Starting server..."
        #     your-server-command --port 8080  # Replace with your server's start command
        #   '';
        # };
        # packages."server" = pkgs.stdenv.mkDerivation {
        #   name = "my-package";
        #   src = ./backend;
        #   buildInputs = [
        #     # Backend
        #     rust
        #   ] ++ commonBuildInputs;
        #   buildPhase = ''
        #     cargo build --release
        #   '';
        #   installPhase = ''
        #     mkdir -p $out/bin
        #     cp target/release/backend $out/bin
        #   '';

        #   shellHook = ''
        #     echo "Hello shell!"
        #   '';
        # };
        packages."srv" = pkgs-unstable.rustPlatform.buildRustPackage {
          pname = "backend";
          version = "0.1.1";
          src = pkgs.lib.cleanSource ./backend;
          cargoLock.lockFile = ./backend/Cargo.lock;
          # buildInputs = [
          #   # Example Run-time Additional Dependencies
          #   pkgs.openapi-generator-cli
          # ];
        };

        # devShell.default = with pkgs;
        #   mkShell { inherit (buildInputs) commonBuildInputs; };

        devShells.default = with pkgs;
          mkShell {
            ANDROID_SDK_ROOT = "${androidSdk}/libexec/android-sdk";
            buildInputs = [
              # Backend
              rust
              caddy

              # Mobile
              flutter
              androidSdk # The customized SDK that we've made above
              jdk17
            ] ++ commonBuildInputs;
          };

        # devShell."backend" = with pkgs;
        #   mkShell rec {
        #     inherit (buildInputs) commonBuildInputs;
        #     buildInputs = [
        #     ];
        #   };
      });
}
