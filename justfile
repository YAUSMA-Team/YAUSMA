parallel:
  #!/usr/bin/env -S parallel --shebang --ungroup --jobs {{ num_cpus() }}
  echo task 1 start; sleep 3; echo task 1 done
  echo task 2 start; sleep 3; echo task 2 done
  echo task 3 start; sleep 3; echo task 3 done
  echo task 4 start; sleep 3; echo task 4 done


release:
  git cliff --bump -o CHANGELOG.md
  git cliff --bumped-version > version.txt

  cd mobile && ./build.nu

  git add .
  git commit -m "Release $(cat version.txt)"
  git tag -a "$(cat version.txt)" -m "Release $(cat version.txt)" 
