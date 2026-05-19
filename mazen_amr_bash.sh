#!/bin/bash

FILE="cv.html"

echo "Checking $FILE for HTML tags"
echo ""

echo "div tags: $(grep -c '<div' $FILE)"
echo "img tags: $(grep -c '<img' $FILE)"
echo "a links: $(grep -c '<a ' $FILE)"
echo "h1 tags: $(grep -c '<h1' $FILE)"
echo "h2 tags: $(grep -c '<h2' $FILE)"
echo "h3 tags: $(grep -c '<h3' $FILE)"

echo ""
echo "done"