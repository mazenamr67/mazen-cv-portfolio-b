#!/bin/bash
# ============================================================
# Mazen Amr — Assessment B Bash Script
# ============================================================

OUTPUT_FILE="Mazen_bash_report.txt"
DIVIDER="============================================================"

HTML_INDEX=$(grep -c 'new:' index.html 2>/dev/null)
HTML_CV=$(grep -c 'new:' cv.html 2>/dev/null)
CSS_COUNT=$(grep -c 'new:' styles.css 2>/dev/null)
JS_COUNT=$(grep -c 'new:' app.js 2>/dev/null)

HTML_INDEX=${HTML_INDEX:-0}
HTML_CV=${HTML_CV:-0}
CSS_COUNT=${CSS_COUNT:-0}
JS_COUNT=${JS_COUNT:-0}

TOTAL=$((HTML_INDEX + HTML_CV + CSS_COUNT + JS_COUNT))

print_report() {
    echo "$DIVIDER"
    echo " MAZEN AMR — ASSESSMENT B NEW LEARNING COMMENT REPORT"
    echo " LZIFC005L Computer Science Ecosystems — Phase 2"
    echo " Generated: $(date '+%d %B %Y at %H:%M:%S')"
    echo "$DIVIDER"
    echo ""
    echo " File-by-File Breakdown:"
    echo ""
    printf "  %-25s → %s new: comments\n" "index.html" "$HTML_INDEX"
    printf "  %-25s → %s new: comments\n" "cv.html" "$HTML_CV"
    printf "  %-25s → %s new: comments\n" "styles.css" "$CSS_COUNT"
    printf "  %-25s → %s new: comments\n" "app.js" "$JS_COUNT"
    echo ""
    echo "$DIVIDER"
    echo ""
    echo " TOTAL NEW LEARNING COMMENTS: $TOTAL"
    echo ""
    echo "$DIVIDER"
    echo ""
    echo " Summary:"
    echo " Each 'new:' comment represents a concept, technique, or API"
    echo " that was newly learned or implemented during Assessment B."
    echo ""
    echo " A total of $TOTAL new learning moments were documented across"
    echo " the project, showing clear growth from Assessment A."
    echo ""
    echo "$DIVIDER"
}

print_report | tee "$OUTPUT_FILE"

echo ""
echo " Report saved to: $OUTPUT_FILE"
echo "$DIVIDER"
