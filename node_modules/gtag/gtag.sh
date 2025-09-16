#!/usr/bin/env sh

if ! [ $1 ]; then
  echo "Git tag shortcut\n\n"
  echo "Usage:\n  $ gtag <tag>\n\n"
  echo "Example:\n  $ gtag 1.0.0\n"
  exit 1
fi

git tag -m ${1} -a "v${1}"
