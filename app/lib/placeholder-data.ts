const snippets = [
  {
    title: 'Quake III Fast Inverse Square Root',
    language: 'C',
    summary: 'Use magic number and Newton\'s method to quickly compute 1/√x, an astonishing combination of bit manipulation and floating-point thinking.',
    code: `float Q_rsqrt(float number) {
    long i;
    float x2, y;
    const float threehalfs = 1.5F;
    x2 = number * 0.5F;
    y  = number;
    i  = *(long *)&y;
    i  = 0x5f3759df - (i >> 1);
    y  = *(float *)&i;
    y  = y * (threehalfs - (x2 * y * y));
    return y;
}`,
    tags: ['bit-hacks', 'floating-point-black-magic', 'performance-optimization'],
    created_at: '2024-01-10T00:00:00.000Z',
  },
  {
    title: 'Linux Kernel\'s container_of Macro',
    language: 'C',
    summary: 'Given a member pointer, member name, and struct type, retrieve the address of the containing struct.',
    code: `#define container_of(ptr, type, member) ({                    \\
    const typeof(((type *)0)->member) *__mptr = (ptr);     \\
    (type *)((char *)__mptr - offsetof(type, member));     \\
})`,
    tags: ['macro-tricks', 'data-structures', 'intrusive-design'],
    created_at: '2024-01-10T00:00:00.000Z',
  },
  {
    title: 'Redis Skip List Insert',
    language: 'C',
    summary: 'Probabilistic multi-layer index providing average O(log N) insert/search for sorted sets.',
    code: `zskiplistNode *zslInsert(zskiplist *zsl, double score, sds ele) {
    zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
    unsigned int rank[ZSKIPLIST_MAXLEVEL];
    int i, level;
    x = zsl->header;
    for (i = zsl->level-1; i >= 0; i--) {
        rank[i] = i == (zsl->level-1) ? 0 : rank[i+1];
        while (x->level[i].forward &&
               (x->level[i].forward->score < score ||
                (x->level[i].forward->score == score &&
                 sdscmp(x->level[i].forward->ele, ele) < 0))) {
            rank[i] += x->level[i].span;
            x = x->level[i].forward;
        }
        update[i] = x;
    }
    level = zslRandomLevel();
    if (level > zsl->level) {
        for (i = zsl->level; i < level; i++) {
            rank[i] = 0;
            update[i] = zsl->header;
            update[i]->level[i].span = zsl->length;
        }
        zsl->level = level;
    }
    x = zslCreateNode(level, score, ele);
    for (i = 0; i < level; i++) {
        x->level[i].forward = update[i]->level[i].forward;
        update[i]->level[i].forward = x;
        x->level[i].span = update[i]->level[i].span - (rank[0] - rank[i]);
        update[i]->level[i].span = (rank[0] - rank[i]) + 1;
    }
    for (i = level; i < zsl->level; i++)
        update[i]->level[i].span++;
    x->backward = (update[0] == zsl->header) ? NULL : update[0];
    if (x->level[0].forward)
        x->level[0].forward->backward = x;
    else
        zsl->tail = x;
    zsl->length++;
    return x;
}`,
    tags: ['probabilistic-data-structure', 'logarithmic-complexity', 'efficient-search'],
    created_at: '2024-02-15T00:00:00.000Z',
  },
  {
    title: 'Single-Producer Single-Consumer Lock-Free Queue',
    language: 'C++',
    summary: 'Lock-free FIFO using only atomic operations and memory barriers, very low latency.',
    code: `template <typename T, size_t N>
class spsc_queue {
    T buffer_[N];
    std::atomic<size_t> head_{0}, tail_{0};
public:
    bool push(const T &item) {
        size_t h = head_.load(std::memory_order_relaxed);
        size_t t = tail_.load(std::memory_order_acquire);
        if (t - h == N) return false;
        buffer_[h % N] = item;
        head_.store(h + 1, std::memory_order_release);
        return true;
    }
    bool pop(T &item) {
        size_t t = tail_.load(std::memory_order_relaxed);
        size_t h = head_.load(std::memory_order_acquire);
        if (h == t) return false;
        item = buffer_[t % N];
        tail_.store(t + 1, std::memory_order_release);
        return true;
    }
};`,
    tags: ['lock-free-programming', 'memory-model', 'high-performance'],
    created_at: '2024-02-20T00:00:00.000Z',
  },
  {
    title: 'Python Cached Property Decorator',
    language: 'Python',
    summary: 'Lazy computation with result caching using a descriptor to improve property access efficiency.',
    code: `class cached_property:
    def __init__(self, func):
        self.func = func
        self.name = func.__name__
    def __get__(self, instance, owner):
        if instance is None:
            return self
        value = self.func(instance)
        instance.__dict__[self.name] = value
        return value`,
    tags: ['design-pattern', 'lazy-evaluation', 'language-feature-magic'],
    created_at: '2024-03-05T00:00:00.000Z',
  },
  {
    title: 'Go Goroutine Leak Detection',
    language: 'Go',
    summary: 'Use runtime.Stack() to check for leftover goroutines at test end, preventing leaks.',
    code: `func VerifyNoLeaks(t testing.TB) {
    before := runtime.NumGoroutine()
    defer func() {
        time.Sleep(100 * time.Millisecond)
        after := runtime.NumGoroutine()
        if after > before {
            buf := make([]byte, 1<<16)
            n := runtime.Stack(buf, true)
            t.Errorf("goroutine leak: %s", buf[:n])
        }
    }()
}`,
    tags: ['testing-tricks', 'resource-management', 'debugging'],
    created_at: '2024-03-12T00:00:00.000Z',
  },
  {
    title: 'Fast Next Power of Two',
    language: 'C',
    summary: 'Bit-spreading technique to convert any integer to the smallest power of two not less than it.',
    code: `unsigned int next_pow2(unsigned int x) {
    x--;
    x |= x >> 1;
    x |= x >> 2;
    x |= x >> 4;
    x |= x >> 8;
    x |= x >> 16;
    return x+1;
}`,
    tags: ['bit-hacks', 'high-performance', 'hash-algorithms'],
    created_at: '2024-04-02T00:00:00.000Z',
  },
  {
    title: 'Bloom Filter for Fast Duplicate Checking',
    language: 'Java',
    summary: 'Use multiple hash functions on a bitset to test membership with extremely high memory efficiency.',
    code: `boolean mightContain(byte[] buf, int m, int k) {
    BitArray bits = new BitArray(m);
    for (int i = 0; i < k; i++) {
        int hash = MurmurHash3.hash32(buf, i);
        if (!bits.get(Math.abs(hash) % m)) return false;
    }
    return true;
}`,
    tags: ['probabilistic-data-structure', 'space-optimization', 'hash-design'],
    created_at: '2024-04-15T00:00:00.000Z',
  },
  {
    title: 'C Language Duff\'s Device',
    language: 'C',
    summary: 'Interleave switch and do-while to achieve extreme loop unrolling optimization.',
    code: `send(to, from, count)
register short *to, *from;
register count;
{
    register n = (count + 7) / 8;
    switch (count % 8) {
    case 0: do { *to = *from++;
    case 7:      *to = *from++;
    case 6:      *to = *from++;
    case 5:      *to = *from++;
    case 4:      *to = *from++;
    case 3:      *to = *from++;
    case 2:      *to = *from++;
    case 1:      *to = *from++;
            } while (--n > 0);
    }
}`,
    tags: ['loop-unrolling', 'compiler-cooperation', 'clever-hack'],
    created_at: '2024-04-28T00:00:00.000Z',
  },
  {
    title: 'Tail-Recursive Parser in Elixir',
    language: 'Elixir',
    summary: 'Use tail recursion and pattern matching to build a low-overhead token parsing loop.',
    code: `defp parse_tokens(<<>>, acc), do: Enum.reverse(acc)
defp parse_tokens(<<char, rest::binary>>, acc) when char in ?0..?9 do
    {num, rest2} = parse_integer(rest, char - ?0)
    parse_tokens(rest2, [{:int, num} | acc])
end
defp parse_tokens(<<char, rest::binary>>, acc) do
    parse_tokens(rest, [{:op, char} | acc])
end`,
    tags: ['functional-programming', 'parser-design', 'tail-call-optimization'],
    created_at: '2024-05-05T00:00:00.000Z',
  },
  {
    title: 'Linux Kernel\'s kfifo Circular Buffer',
    language: 'C',
    summary: 'Unsigned integer overflow and memory barriers construct a lock-free circular queue.',
    code: `#define kfifo_put(fifo, val) \\
({ \\
    typeof(val) __val = (val); \\
    smp_mb(); \\
    while (kfifo_is_full(fifo)) \\
        cpu_relax(); \\
    __kfifo->data[__kfifo->in & (__kfifo->size - 1)] = __val; \\
    smp_wmb(); \\
    __kfifo->in++; \\
})`,
    tags: ['lock-free-programming', 'memory-barrier', 'kernel-tricks'],
    created_at: '2024-05-18T00:00:00.000Z',
  },
  {
    title: 'Python \'with\' Context Manager Implementation',
    language: 'Python',
    summary: 'Use generator function yield to separate pre and post logic, simplifying resource management.',
    code: `from contextlib import contextmanager
@contextmanager
def open_file(name, mode):
    f = open(name, mode)
    try:
        yield f
    finally:
        f.close()`,
    tags: ['language-feature', 'resource-management', 'code-pattern'],
    created_at: '2024-06-01T00:00:00.000Z',
  },
  {
    title: 'Redis sds Dynamic String',
    language: 'C',
    summary: 'Store length information ahead of C string for O(1) length retrieval and efficient resizing.',
    code: `struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len;
    uint8_t alloc;
    unsigned char flags;
    char buf[];
};
static inline size_t sdslen(const sds s) {
    return ((struct sdshdr8 *)(s - 1))->len;
}`,
    tags: ['memory-management', 'data-structures', 'embedded-metadata'],
    created_at: '2024-06-12T00:00:00.000Z',
  },
  {
    title: '3-Way Partition Quicksort',
    language: 'C',
    summary: 'Split array into less, equal, greater parts, nearly linear for data with many duplicates.',
    code: `void quicksort(int a[], int l, int r) {
    if (r <= l) return;
    int i = l-1, j = r, p = l-1, q = r;
    int v = a[r];
    for (;;) {
        while (a[++i] < v) ;
        while (v < a[--j]) if (j == l) break;
        if (i >= j) break;
        swap(a,i,j);
        if (a[i] == v) { p++; swap(a,p,i); }
        if (v == a[j]) { q--; swap(a,j,q); }
    }
    swap(a,i,r);
    j = i-1; i = i+1;
    for (int k = l; k <= p; k++, j--) swap(a,k,j);
    for (int k = r-1; k >= q; k--, i++) swap(a,k,i);
    quicksort(a,l,j);
    quicksort(a,i,r);
}`,
    tags: ['sorting-algorithm', 'duplicate-data-optimization', 'classic-implementation'],
    created_at: '2024-06-26T00:00:00.000Z',
  },
  {
    title: 'Zero-Length Array for Variable-Length Struct',
    language: 'C',
    summary: 'Declare zero-length array at struct end to allocate struct and dynamic buffer together.',
    code: `struct msg {
    uint32_t len;
    char data[];
};
struct msg *m = malloc(sizeof(*m) + payload_len);
m->len = payload_len;
memcpy(m->data, buf, payload_len);`,
    tags: ['memory-packing', 'data-structures', 'performance'],
    created_at: '2024-07-08T00:00:00.000Z',
  },
  {
    title: 'Go sync.Once Primitive',
    language: 'Go',
    summary: 'Use atomic operation + mutex to execute a function exactly once, minimizing fast-path overhead.',
    code: `func (o *Once) Do(f func()) {
    if atomic.LoadUint32(&o.done) == 0 {
        o.doSlow(f)
    }
}
func (o *Once) doSlow(f func()) {
    o.m.Lock()
    defer o.m.Unlock()
    if o.done == 0 {
        f()
        atomic.StoreUint32(&o.done, 1)
    }
}`,
    tags: ['concurrency-control', 'atomic-operation', 'design-pattern'],
    created_at: '2024-07-21T00:00:00.000Z',
  },
  {
    title: 'Bit Reversal Trick',
    language: 'C',
    summary: 'Swap bit pairs via divide-and-conquer masks, reversing 32-bit integer in 15 operations.',
    code: `unsigned int reverse(unsigned int x) {
    x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
    x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
    x = ((x >> 4) & 0x0F0F0F0F) | ((x & 0x0F0F0F0F) << 4);
    x = ((x >> 8) & 0x00FF00FF) | ((x & 0x00FF00FF) << 8);
    x = ( x >> 16 ) | ( x << 16 );
    return x;
}`,
    tags: ['bit-hacks', 'divide-and-conquer', 'branchless-programming'],
    created_at: '2024-08-04T00:00:00.000Z',
  },
  {
    title: 'C Language do{...}while(0) Macro Protection',
    language: 'C',
    summary: 'Allow multi-statement macros to appear safely in if-else constructs and enforce a semicolon.',
    code: `#define LOG(msg, ...) \\
    do { \\
        fprintf(stderr, "[%s:%d] " msg, __FILE__, __LINE__, ##__VA_ARGS__); \\
    } while(0)`,
    tags: ['preprocessor-tricks', 'defensive-programming', 'macro-safety'],
    created_at: '2024-08-19T00:00:00.000Z',
  },
  {
    title: 'Unsigned Subtraction for Saturation (TCP Sequence Comparison)',
    language: 'C',
    summary: 'Use natural wrap-around of unsigned subtraction to determine order, avoiding overflow issues.',
    code: `/* Return true if seq1 < seq2 */
int before(unsigned int seq1, unsigned int seq2) {
    return (int)(seq1 - seq2) < 0;
}`,
    tags: ['overflow-exploitation', 'protocol-design', 'bit-manipulation'],
    created_at: '2024-09-02T00:00:00.000Z',
  },
  {
    title: 'Timeout Retry Using select',
    language: 'Python',
    summary: 'Set timeout on socket and wait for writable/readable, implementing timed network operations cleanly.',
    code: `import select
def send_timeout(sock, data, timeout=5):
    _, wlist, _ = select.select([], [sock], [], timeout)
    if wlist:
        return sock.send(data)
    raise TimeoutError()`,
    tags: ['network-programming', 'timeout-pattern', 'syscall-reuse'],
    created_at: '2024-09-15T00:00:00.000Z',
  },
];

const tags = [
  { name: 'bit-hacks', displayName: 'Bit Hacks' },
  { name: 'floating-point-black-magic', displayName: 'Floating-point Black Magic' },
  { name: 'performance-optimization', displayName: 'Performance Optimization' },
  { name: 'macro-tricks', displayName: 'Macro Tricks' },
  { name: 'data-structures', displayName: 'Data Structures' },
  { name: 'intrusive-design', displayName: 'Intrusive Design' },
  { name: 'probabilistic-data-structure', displayName: 'Probabilistic Data Structure' },
  { name: 'logarithmic-complexity', displayName: 'Logarithmic Complexity' },
  { name: 'efficient-search', displayName: 'Efficient Search' },
  { name: 'lock-free-programming', displayName: 'Lock-Free Programming' },
  { name: 'memory-model', displayName: 'Memory Model' },
  { name: 'high-performance', displayName: 'High Performance' },
  { name: 'design-pattern', displayName: 'Design Pattern' },
  { name: 'lazy-evaluation', displayName: 'Lazy Evaluation' },
  { name: 'language-feature-magic', displayName: 'Language Feature Magic' },
  { name: 'testing-tricks', displayName: 'Testing Tricks' },
  { name: 'resource-management', displayName: 'Resource Management' },
  { name: 'debugging', displayName: 'Debugging' },
  { name: 'hash-algorithms', displayName: 'Hash Algorithms' },
  { name: 'space-optimization', displayName: 'Space Optimization' },
  { name: 'hash-design', displayName: 'Hash Design' },
  { name: 'loop-unrolling', displayName: 'Loop Unrolling' },
  { name: 'compiler-cooperation', displayName: 'Compiler Cooperation' },
  { name: 'clever-hack', displayName: 'Clever Hack' },
  { name: 'functional-programming', displayName: 'Functional Programming' },
  { name: 'parser-design', displayName: 'Parser Design' },
  { name: 'tail-call-optimization', displayName: 'Tail Call Optimization' },
  { name: 'memory-barrier', displayName: 'Memory Barrier' },
  { name: 'kernel-tricks', displayName: 'Kernel Tricks' },
  { name: 'language-feature', displayName: 'Language Feature' },
  { name: 'code-pattern', displayName: 'Code Pattern' },
  { name: 'memory-management', displayName: 'Memory Management' },
  { name: 'embedded-metadata', displayName: 'Embedded Metadata' },
  { name: 'sorting-algorithm', displayName: 'Sorting Algorithm' },
  { name: 'duplicate-data-optimization', displayName: 'Duplicate Data Optimization' },
  { name: 'classic-implementation', displayName: 'Classic Implementation' },
  { name: 'memory-packing', displayName: 'Memory Packing' },
  { name: 'performance', displayName: 'Performance' },
  { name: 'concurrency-control', displayName: 'Concurrency Control' },
  { name: 'atomic-operation', displayName: 'Atomic Operation' },
  { name: 'divide-and-conquer', displayName: 'Divide and Conquer' },
  { name: 'branchless-programming', displayName: 'Branchless Programming' },
  { name: 'preprocessor-tricks', displayName: 'Preprocessor Tricks' },
  { name: 'defensive-programming', displayName: 'Defensive Programming' },
  { name: 'macro-safety', displayName: 'Macro Safety' },
  { name: 'overflow-exploitation', displayName: 'Overflow Exploitation' },
  { name: 'protocol-design', displayName: 'Protocol Design' },
  { name: 'network-programming', displayName: 'Network Programming' },
  { name: 'timeout-pattern', displayName: 'Timeout Pattern' },
  { name: 'syscall-reuse', displayName: 'Syscall Reuse' },
];

export { snippets, tags };