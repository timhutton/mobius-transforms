// Emscripten
#include <emscripten/bind.h>
using namespace emscripten;

// stdlib
#include <cstdint>

class Buffer
{
    public:
        Buffer(int n)
            : m_n(n)
        {
            m_arr = new uint8_t[ n ];
            m_arr[0] = static_cast<uint8_t>(111);
            m_arr[1] = static_cast<uint8_t>(75);
            m_arr[2] = static_cast<uint8_t>(33);
        }
        int size() { return m_n; }
        int pointer()
        {
            return reinterpret_cast<int>(m_arr);
        }

    private:
        int m_n;
        uint8_t* m_arr;
};

Buffer compute()
{
    Buffer b(7);
    return b;
}

EMSCRIPTEN_BINDINGS(my_module) {
    class_<Buffer>("Buffer")
    .constructor<int>()
    .function("size", &Buffer::size)
    .function("pointer", &Buffer::pointer);

    function("compute", &compute);
}
