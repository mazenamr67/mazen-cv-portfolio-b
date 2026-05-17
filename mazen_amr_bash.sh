#!/bin/bash

echo "===================================="
echo "HTML Analysis Script - Mazen Amr"
echo "===================================="

FILE="cv.html"

if [ ! -f "$FILE" ]; then
    echo "Error: $FILE not found!"
    exit 1
fi

echo "Analyzing $FILE..."
echo ""

echo "Number of <div> tags: $(grep -c '<div' $FILE)"
echo "Number of <p> tags: $(grep -c '<p' $FILE)"
echo "Number of links (<a ): $(grep -c '<a ' $FILE)"
echo "Number of <h1> tags: $(grep -c '<h1' $FILE)"
echo "Number of <h2> tags: $(grep -c '<h2' $FILE)"
echo "===================================="
echo "Analysis completed successfully!"