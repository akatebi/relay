#!/usr/bin/bash

branch_name=$1

if [ -z "$branch_name" ]; then
  echo "Please provide a branch name"
  echo "==>> $0 <branch>"
  exit
fi

echo "Are you sure you want to delete remove branch $branch_name?"
while read line
do
  # echo "$line"
  if [ "$line" == "yes" ]; then
    break;
  fi
  echo "please type <yes>"
  exit
done

echo "switching to the Alpha7 branch & pulling..."
git checkout Alpha7
git pull

echo "removing the remote branch $branch_name"
git push origin --delete $branch_name

echo "removing the local branch $branch_name"
git branch -D $branch_name

if [ $branch_name == relay ]; then
  echo "creating new branch $branch_name"
  git checkout -b $branch_name
fi
