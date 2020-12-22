#! /bin/bash

yarnLockFiles=`npx lerna la -a | awk -F packages '{printf "packages%s/yarn.lock ", $2}'`
validYarnLockFiles=""

for file in $yarnLockFiles
do
    if test -f $file; then
        validYarnLockFiles="$validYarnLockFiles $file"
    fi
done

echo $validYarnLockFiles