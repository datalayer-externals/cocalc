#!/usr/bin/env bash
set -ev


export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

export SRC="$SCRIPT_DIR"/../

mkdir -p smc-webapp
echo "THIS DIRECTORY IS AUTOGENERATED" > smc-webapp/AUTOGENERATED.txt
mkdir -p smc-util
echo "THIS DIRECTORY IS AUTOGENERATED" > smc-util/AUTOGENERATED.txt

cp $SRC/smc-webapp/file-associations.ts smc-webapp/

mkdir -p smc-webapp/codemirror/
rsync -axvH $SRC/smc-webapp/codemirror/static.tsx smc-webapp/codemirror/static.tsx
rsync -axvH $SRC/smc-webapp/codemirror/modes.js smc-webapp/codemirror/modes.js
rsync -axvH $SRC/smc-webapp/codemirror/mode/ smc-webapp/codemirror/mode/

mkdir -p smc-webapp/markdown/
rsync -axvH --delete --exclude /table-of-contents.ts --exclude /index.ts $SRC/smc-webapp/markdown/ smc-webapp/markdown/

rsync -axvH $SRC/smc-util/markdown-utils.ts smc-util/markdown-utils.ts
rsync -axvH $SRC/smc-util/mathjax-utils.js smc-util/mathjax-utils.js
rsync -axvH $SRC/smc-util/replace-all.ts smc-util/replace-all.ts
rsync -axvH $SRC/smc-util/regex-split.js smc-util/regex-split.js
