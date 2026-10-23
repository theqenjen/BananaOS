; BananaOS - multiboot2 32-bit kernel entry (NASM, elf32)
section .multiboot
align 8
header_start:
    dd 0xe85250d6                         ; magic (multiboot2)
    dd 0                                  ; architecture: i386 protected mode
    dd header_end - header_start          ; header length
    dd 0x100000000 - (0xe85250d6 + 0 + (header_end - header_start)) ; checksum
    ; end tag
    dw 0                                  ; type
    dw 0                                  ; flags
    dd 8                                  ; size
header_end:

section .bss
align 16
stack_bottom:
    resb 16384                            ; 16 KiB kernel stack
stack_top:

section .text
global _start
extern kmain

_start:
    mov esp, stack_top
    call kmain
    cli
.hang:
    hlt
    jmp .hang
