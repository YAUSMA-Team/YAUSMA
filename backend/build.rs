use api::*;
use fs_extra::dir::{CopyOptions, copy};
use std::{
    fs::{self},
    process::Command,
};

fn main() {
    // Gen openapi.yaml ONLY if in debug mode
    if cfg!(debug_assertions) {
        let spec = get_spec();
        fs::write("../openapi.yaml", serde_yaml::to_string(&spec).unwrap()).unwrap();

        let output = Command::new("openapi-generator-cli")
        .arg("validate")
        .arg("-i")
        .arg("../openapi.yaml")
        .output()
        .expect("Failed verify generated openapi.yaml. Likely something is wrong with endpoints in rust. Or you don't have openapi-generator-cli installed");
        if output.status.success() {
            println!("Output:\n{}", String::from_utf8_lossy(&output.stdout));
        } else {
            eprintln!("Error:\n{}", String::from_utf8_lossy(&output.stderr));
        }
        // let options = CopyOptions::new()
        //     .overwrite(true)
        //     .skip_exist(false)
        //     .copy_inside(true); // Recursive copy

        // copy("../web", "./static", &options).expect("Copy frontend to `static` to serve");
    }

    println!("cargo:rerun-if-changed=src/main.rs"); // Rebuild on changes
    println!("cargo:rerun-if-changed=src/build.rs"); // Rebuild on changes
}
