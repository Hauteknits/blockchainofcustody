all:
	curl -fsSL https://deno.land/install.sh | sh
	/root/.deno/bin/deno compile -A -o bchoc index.js
	chmod +x bchoc