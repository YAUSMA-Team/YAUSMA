use api::*;
use rocket_okapi::openapi_get_spec;
use std::{
    env,
    fs::{self, File},
    io::Write,
    path::Path,
    process::Command,
};

fn main() {
    // (1) Generate OpenAPI spec by listing all endpoints
    // crate::get_prices();

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
    // let output = Command::new("openapi-generator-cli")
    //     .args(["generate", "-i", "../openapi.yaml", "-g", "dart", "-o", "../mobile/api"])
    //     .output()
    //     .expect("Failed verify generated openapi.yaml. Likely something is wrong with endpoints in rust. Or you don't have openapi-generator-cli installed");
    // if output.status.success() {
    //     println!("Output:\n{}", String::from_utf8_lossy(&output.stdout));
    // } else {
    //     eprintln!("Error:\n{}", String::from_utf8_lossy(&output.stderr));
    // }

    println!("cargo:rerun-if-changed=src/main.rs"); // Rebuild on changes
    println!("cargo:rerun-if-changed=src/build.rs"); // Rebuild on changes
    // println!("cargo:rerun-if-changed=../openapi.yaml"); // Rebuild on changes

    // println!("cargo:rerun-if-changed=src/**"); // Rebuild on changes
}
