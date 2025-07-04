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
          nushell
          openapi-generator-cli
        ];
        server = pkgs-unstable.rustPlatform.buildRustPackage {
          pname = "yausma-server-unwrapped";
          version = "0.1.1";
          src = pkgs.lib.cleanSource ./backend;
          cargoLock.lockFile = ./backend/Cargo.lock;
          # buildInputs = [
          #   # Example Run-time Additional Dependencies
          #   pkgs.openapi-generator-cli
          # ];
          # 
        };

        sh = self.devShells.${system};
      in {
        packages."server-unwrapped" = server;

        packages."server" = pkgs.stdenv.mkDerivation {
          pname = "yausma-server"; # Required field
          version = "0.1.0"; # Required field

          # Ensure all dependencies are available
          nativeBuildInputs = [ pkgs.makeWrapper pkgs.caddy ];

          # No actual source needed for this simple script
          dontUnpack = true;

          # ${pkgs.caddy}/bin/caddy reverse-proxy --from :2000 --to :8000 &
          # ${pkgs.caddy}/bin/caddy reverse-proxy --from v.rockhoster.net --to :8000 &
          installPhase = ''
            mkdir -p $out/bin
            cat <<EOF > $out/bin/yausma-server
            #!/bin/sh
            ROCKET_ADDRESS=0.0.0.0 ${
              self.packages.${system}."server-unwrapped"
            }/bin/backend
            EOF
            chmod +x $out/bin/yausma-server
          '';

          meta = {
            description = "YAUSMA production server script";
            license = pkgs.lib.licenses.mit;
          };
        };

        packages.docker = pkgs.dockerTools.buildLayeredImage {
          name = "yausma-server-image";
          tag = "latest";
          contents = with pkgs; [
            cacert
            (pkgs.runCommand "copy-frontend" { } ''
              mkdir -p $out/static
              cp -r ${./web}/* $out/static/
            '')
          ];
          config = {
            Env = [ "ROCKET_ADDRESS=0.0.0.0" "RUST_LOG=debug" ];
            Cmd = "${server}/bin/backend";
          };
        };

        devShells.mobile = with pkgs;
          mkShell {
            ANDROID_SDK_ROOT = "${androidSdk}/libexec/android-sdk";

            buildInputs = [
              flutter
              androidSdk # The customized SDK that we've made above
              jdk17
            ] ++ commonBuildInputs;
          };

        devShells.backend = with pkgs;
          mkShell {
            RUST_LOG = "debug";
            RUSTFLAGS = "-D warnings";
            buildInputs = [
              # Backend
              rust
            ] ++ commonBuildInputs;
          };

        devShells.release = with pkgs-unstable;
          mkShell { buildInputs = [ git just nushell git-cliff ]; };

        devShells.default = with pkgs;
          mkShell {
            RUST_LOG = "debug";
            ANDROID_SDK_ROOT = "${androidSdk}/libexec/android-sdk";

            buildInputs = [
              flutter
              androidSdk # The customized SDK that we've made above
              jdk17
              # Backend
              rust
              git
              just
              nushell
              pkgs-unstable.git-cliff
            ] ++ commonBuildInputs;
          };
      });
}
