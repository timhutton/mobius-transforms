#include <emscripten/emscripten.h>
#include <stdio.h>

extern "C" void EMSCRIPTEN_KEEPALIVE hello() {
  printf("hello, world!\n");
}
