makeFileDir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

start:
	docker build -t trufans . && docker run --name trufans_container -p 0.0.0.0:3000:3000 trufans

.PHONY: start 
