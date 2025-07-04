release:
  git cliff --bump -o CHANGELOG.md
  git cliff --bumped-version > version.txt
  cd mobile && ./build.nu
  cd backend && ./build.nu
  git add .
  # git commit -m "Release $(cat version.txt)"
  git tag -a "$(cat version.txt)" -m "Release $(cat version.txt)" 
