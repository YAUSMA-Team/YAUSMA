#! /usr/bin/env nu
 
def main [] {
  let version = open ../version.txt | str replace "v" "" | str trim;

  let next_build = ( open pubspec.yaml | get version | split row '+' | get 1 | into int ) + 1

  open ./pubspec.yaml | update version ($"($version)+($next_build)" | str trim) | save -f ./pubspec.yaml
}
