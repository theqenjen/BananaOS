FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc-multilib make nasm xorriso grub-pc-bin grub-common mtools \
        qemu-system-x86 python3 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
