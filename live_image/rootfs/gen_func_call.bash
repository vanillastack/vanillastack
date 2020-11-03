#!/bin/bash

SOURCES=" /usr/share/live/build/functions /usr/share/live/build/hooks /usr/lib/live /usr/lib/live/build"
[[ -n "$1" ]] || exit 1
OUTFILE=$1

DEBUG=FALSE

STDERR() {
  echo "$*" > /dev/stderr
}

LOG() {
  case $1 in
    -n) shift; echo -n "$*" ;;
    *) echo "LOG: $*" ;;
  esac
}

DBG() {
  [[ "$DEBUG" == TRUE ]] && \
    case $1 in
      -n) shift; echo -n "$*" 2>/dev/stderr|| : ;;
      *) echo "DBG: $*" 2>/dev/stderr|| : ;;
    esac
}


FAIL() {
  STDERR "FAIL: $*"
  exit 9
}

ERR() {
  STDERR "ERR: $*"
  exit 1
}



SOURCEFILES=""


for SRCDIR in $SOURCES;
  do
    DBG "registering sourcedir: $SRCDIR"
    for SRC in $SRCDIR/*
      do
        if [[ -f $SRC ]]
          then
            DBG "registering source: $SRC"
            SOURCEFILES+="$SRC "
          fi
      done
  done

declare -A dict_func
declare -A dict_scope

# find function definitions
while IFS=": " read -r F LNR FNC _R;
        do
          FUNC="${FNC%%()*}"
          DBG "$F: function $FUNC in L$LNR"
          dict_func[$FUNC]="$F:$LNR"
        done < <(
            for SRCDIR in $SOURCES;
              do
                grep -EnH '[^ ]+ *\()' $SRCDIR/* \
                  | grep -vE "^[^(]*#.*\()"
              done ;
                )


# find callers
for SRCFILE in $SOURCEFILES;
  do
    DBG "Reading $SRCFILE for function calls:"
    LNR=0;
    SCOPE="main"
    while read -r LINE;
      do
        LOG -n .
        if echo "$LINE" | grep -E '[^ ]+ *\()' | grep -qvE '^[^(]*#.*\()'
          then
            SCOPE="${LINE%%()*}"
          fi
        if echo "$LINE" | grep -qE '^[ ]*}[ ]*(|#.*)$'
          then
            SCOPE="main"
          fi
        dict_scope["$SRCFILE:$LNR"]="$SCOPE"
        LNR=$(( LNR + 1))
      done < $SRCFILE
    echo
  done


F_CALLS="$(
    for SRCFILE in $SOURCEFILES
        do
          grep -HnEof <(for F in ${!dict_func[*]}; do echo $F; done) $SRCFILE
        done | sort -n
  )"

echo "digraph G { rankdir=LR;" > $OUTFILE
CN=0;
FP=""
F=""
echo "subgraph cluster_X {" >> $OUTFILE
echo "subgraph cluster$CN {" >> $OUTFILE
for CALL in $F_CALLS
  do
    FN="${CALL%%:*}"
    FNP="${FN%%live*}"
    if [[ "$FN" != "$F" ]]
      then
        F="$FN"
        CN=$((CN + 1))
        echo "}" >> $OUTFILE
        echo "subgraph cluster$CN {" >> $OUTFILE
      fi
    LOC="$(echo $CALL|cut -d : -f 1,2)"
    echo "\"${LOC%%:*}:${dict_scope[$LOC]}\";" >> $OUTFILE
  done
echo "}" >> $OUTFILE

while IFS=": " read -r F LNR FNC _R;
        do
          FLOC="${dict_func[$FNC]}"
          echo "\"$F:${dict_scope[$F:$LNR]}\" -> \"${FLOC%%:*}:$FNC\";" >> $OUTFILE
        done < <(echo "$F_CALLS")


echo "}" >> $OUTFILE
