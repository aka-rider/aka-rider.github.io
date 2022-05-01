THIS_MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJ_ROOT := $(patsubst %/,%,$(dir $(THIS_MAKEFILE_PATH)))

DOCKER_IMG := jekyll/jekyll:latest
PORT := 4000

.PHONY: all build serve clean
all: build

build:
	docker run --rm --volume="$(PROJ_ROOT):/srv/jekyll" -it $(DOCKER_IMG) jekyll build

serve:
	@echo "http://localhost:$(PORT)/"
	docker run -p $(PORT):$(PORT) --volume="$(PROJ_ROOT):/srv/jekyll" -it $(DOCKER_IMG) jekyll serve --watch --incremental --drafts --port $(PORT)

clean:
	rm -rf "$(PROJ_ROOT)/_site/"*
	rm -rf "$(PROJ_ROOT)/.jekyll-cache"
	rm -f "$(PROJ_ROOT)/.jekyll-metadata"
