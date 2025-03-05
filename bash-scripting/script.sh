#!/bin/bash

# Variables
# Always keep variable lowercase
# For Env variables use UPPERCASE
# name="Rakesh"

# echo "Welcome, $name!"

# If-else
# name="Backend"

# if [ "$name" == "Rakesh" ]; then
#     echo "You are Rakesh!"
# else
#     echo "You are not Rakesh!"
# fi

# Single Quotes vs Double Quotes
# name="Backend"

# echo "Welcome, $name"


# For loops

# for num in 1 2 3 4 5; do
#     echo $num
#     sleep 0.5
# done


# for num in {1..100}; do
#     echo $num
# done


# Lists

# languages=("java" "golang" "javascript")

# for item in "${languages[@]}"; do
#     echo $item
# done

# for ((i=0; i < "${#languages[@]}"; i++)); do
#     echo "${languages[i]}"
# done

# Program Arguments
# echo $1


# Named arguments

# while getopts ":u:p:" opt; do
#     case $opt in
#         u) username="$OPTARG";;
#         p) password="$OPTARG";;
#         \?) echo "Invalid option"
#     esac
# done

# echo "Username: $username"
# echo "Password: $password"

# Prompt
# YELLOW='\033[0;33m'
# NC='\033[0m'
# echo -n "Enter your name: "
# read name
# echo -e "${YELLOW}Welcome: $name${NC}"
# echo "hello there"
# read -sp "Enter your password: " password
# echo "Your password: $password"


# Creating files
# echo "Welcome to backend cohort" > welcome.txt
# cat welcome.txt

# here-document
# cat > welcome.txt << EOL
# Welcome to backend cohort.
# Cohort started on feb 8th
# We are enjoying.
# EOL

# Folders
# mkdir -p {hello,welcome,nice,config}


# string operations
# echo "Hello World" > example.txt

# stream editor (Line by line)
# sed -i '' 's/World/Backend/g' example.txt

