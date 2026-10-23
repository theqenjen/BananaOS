# BananaOS build system
CC      := gcc
NASM    := nasm
CFLAGS  := -m32 -ffreestanding -nostdlib -nostartfiles -fno-pie -no-pie \
           -fno-stack-protector -Wall -Wextra -O2 -g
LDFLAGS := -m32 -ffreestanding -nostdlib -nostartfiles -fno-pie -no-pie \
           -T linker.ld -z max-page-size=0x1000

SRC := src
OBJ := obj
OBJS := $(OBJ)/boot.o $(OBJ)/kernel.o $(OBJ)/vga.o $(OBJ)/serial.o

ISO_DIR := iso

.PHONY: all clean run

all: bananaos.iso

$(OBJ):
	mkdir -p $(OBJ)

$(OBJ)/boot.o: $(SRC)/boot.asm | $(OBJ)
	$(NASM) -f elf32 $< -o $@

$(OBJ)/%.o: $(SRC)/%.c | $(OBJ)
	$(CC) $(CFLAGS) -c $< -o $@

kernel.elf: $(OBJS) linker.ld
	$(CC) $(LDFLAGS) -o $@ $(OBJS)

bananaos.iso: kernel.elf grub.cfg
	rm -rf $(ISO_DIR)
	mkdir -p $(ISO_DIR)/boot/grub
	cp kernel.elf $(ISO_DIR)/boot/kernel.elf
	cp grub.cfg $(ISO_DIR)/boot/grub/grub.cfg
	grub-mkrescue -o $@ $(ISO_DIR)

run: bananaos.iso
	qemu-system-i386 -cdrom bananaos.iso -m 64M -serial stdio

clean:
	rm -rf $(OBJ) kernel.elf bananaos.iso $(ISO_DIR)
