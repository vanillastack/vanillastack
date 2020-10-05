#!/bin/sh

if [ -z "$PV_BASE_URL" ]; then
	export PV_BASE_URL="https://repo.polyverse.io/cli"  # default
fi

export PV_SHELL="sh"
if [ ! -z "$(echo $SHELL | grep bash)" ]; then
	export PV_SHELL="bash"
fi

main() {
	if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ] || [ "$1" = "help" ]; then
		displayUsage
		return 0
	fi

	SUBCMD="$1"
	shift

	curl -s --fail "$PV_BASE_URL/$SUBCMD" >/dev/null 2>&1
	if [ $? -ne 0 ]; then
		(>&2 echo "error: unknown subcommand '$SUBCMD'.")
		return 1
	fi

	curl -sS $PV_BASE_URL/$SUBCMD | $PV_SHELL -s $SUBCMD "$@"
	return $?
}

################################################################################
displayUsage() {
cat >&2 <<-EOF

$PV_BASE_URL serves utility scripts for Polyverse customers.

usage: curl -s $PV_BASE_URL | sh -s <subcommand> [<options>]

Available subcommands:

info                       Output basic system information.
install                    Install Polyverse polymorphic version of Linux®
list-installed             List installed packages, version and source repo.
list-installed-elf         List ELF file's package, repo and PV-signature.
replace-installed-elf      Replace existing ELF files with Polymorphic Linux® version.

For help on a subcommand, run "curl $PV_BASE_URL | sh -s <subcommand> --help".

If you encounter any issues, please contact us at support@polyverse.com.

EOF
return 0
}

main "$@"
exit $?