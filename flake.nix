{
  description = "Flutter 3.13.x";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/23.11";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };
  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ (import rust-overlay) ];
          config = {
            android_sdk.accept_license = true;
            allowUnfree = true;
          };
        };
        rust = pkgs.rust-bin.stable.latest.default.override {
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
        # devShell.default = with pkgs;
        #   mkShell { inherit (buildInputs) commonBuildInputs; };

        devShells.default = with pkgs;
          mkShell {
            ANDROID_SDK_ROOT = "${androidSdk}/libexec/android-sdk";
            buildInputs = [
              # Backend
              rust

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

