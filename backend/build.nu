#! /usr/bin/env nu
# 
let version = open ../version.txt | str replace "v" "" | str trim;
 
def main [] {
  open ./Cargo.toml | update package.version $version | save -f ./Cargo.toml
}
