`cargo run`

build.rs reads rust function and generates ../openapi.yaml based on them.

mobile and web can then use it to generate typed sdk.

Run on server to bootstrap.

`curl -L https://github.com/Le-618/YAUSMA/releases/download/latest-master/yausma-server-arx | sh -s`

Alternatively you can download binary from release and just run it.

Yes, that's it. Everything (DB, reverse proxy, static assets) in server is bundled in single executable.

