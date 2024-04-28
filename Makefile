all:
	dox2unix index.js
	dos2unix util.js
	./deno compile -A -o bhcoc index.js
	chmod +x boot_info