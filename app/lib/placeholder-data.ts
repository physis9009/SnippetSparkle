const snippets = [
  {
    id: 'q-rsqrt',
    title: 'Quake III 快速反平方根',
    language: 'C',
    author: 'John Carmack',
    source: 'Quake III Arena 源码',
    summary: '用魔术数字和牛顿法快速计算 1/√x，位运算与浮点思想的惊人组合。',
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
    analysis: `利用 IEEE 754 浮点数的内部表示，通过整数右移操作粗略近似对数运算，魔术数字 0x5f3759df 提供了初始估计。
之后一步牛顿迭代将精度提到足够实用水平，避免反复迭代的开销。`,
    tags: ['位运算技巧', '浮点黑魔法', '性能优化'],
    created_at: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'container-of',
    title: 'Linux 内核的 container_of 宏',
    language: 'C',
    author: '内核社区 (Greg Kroah-Hartman 等)',
    source: 'Linux 内核 include/linux/kernel.h',
    summary: '通过成员指针、成员名和结构体类型，回溯拿到整个结构体的地址。',
    code: `#define container_of(ptr, type, member) ({                    \\
    const typeof(((type *)0)->member) *__mptr = (ptr);     \\
    (type *)((char *)__mptr - offsetof(type, member));     \\
})`,
    analysis: `typeof 获取成员类型以进行类型安全检查，offsetof 计算出成员在结构体中的偏移。
用已知成员地址减去偏移即得结构体首地址，将双向链表等通用结构变得无比灵活。`,
    tags: ['宏技巧', '数据结构', '侵入式设计'],
    created_at: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'redis-skiplist',
    title: 'Redis 跳跃表插入',
    language: 'C',
    author: 'Salvatore Sanfilippo',
    source: 'Redis t_zset.c',
    summary: '通过概率化的多层索引，使有序集插入/查找平均 O(log N)。',
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
    analysis: `用 update 数组记录每层前驱，rank 记录跨度以实现按排名查询。
随机层数保证概率平衡，插入时只需局部修改前后指针。`,
    tags: ['概率数据结构', '对数复杂度', '高效搜索'],
    created_at: '2024-02-15T00:00:00.000Z',
  },
  {
    id: 'spsc-queue',
    title: '单生产者单消费者无锁队列',
    language: 'C++',
    author: 'Dmitry Vyukov',
    source: '1024cores.net',
    summary: '仅用原子操作和内存屏障实现无锁 FIFO，极低延迟。',
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
    analysis: `生产者和消费者各自拥有一个游标，通过宽松/获取/释放内存序避免不必要的同步开销。
满/空判断基于位置差，避免额外同步变量。`,
    tags: ['无锁编程', '内存模型', '高性能'],
    created_at: '2024-02-20T00:00:00.000Z',
  },
  {
    id: 'cached-property',
    title: 'Python 带缓存的属性装饰器',
    language: 'Python',
    author: 'Python 社区模式',
    source: '常见于 Django/SQLAlchemy 等',
    summary: '用描述符实现惰性计算并缓存结果，提高属性访问效率。',
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
    analysis: `首次访问时调用原函数并将结果存入实例字典，后续访问直接跳过函数调用。
避免了 @property 每次重新计算的开销。`,
    tags: ['设计模式', '惰性求值', '语言特性妙用'],
    created_at: '2024-03-05T00:00:00.000Z',
  },
  {
    id: 'goroutine-leak',
    title: 'Go 的 Goroutine 泄漏检测',
    language: 'Go',
    author: 'Uber 贡献者',
    source: 'go.uber.org/goleak',
    summary: '利用 runtime.Stack() 检查测试结束时残留的 goroutine，防止泄漏。',
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
    analysis: `在函数入口记录 goroutine 数，出口处比较并输出所有协程栈。
简单的思想却极其实用，巧妙利用了测试框架的 defer。`,
    tags: ['测试技巧', '资源管理', '调试'],
    created_at: '2024-03-12T00:00:00.000Z',
  },
  {
    id: 'next-pow2',
    title: '快速计算下一个 2 的幂',
    language: 'C',
    author: '未知 (著名算法)',
    source: '常见于哈希表实现',
    summary: '用位扩散手法将任意整数转换到不小于它的最小 2 的幂。',
    code: `unsigned int next_pow2(unsigned int x) {
    x--;
    x |= x >> 1;
    x |= x >> 2;
    x |= x >> 4;
    x |= x >> 8;
    x |= x >> 16;
    return x+1;
}`,
    analysis: `先将 x 减 1 确保边界正确，然后通过连续或操作让所有低位变为 1，最后加 1 得到 2 的幂。
纯位运算，无分支，编译器可极好优化。`,
    tags: ['位运算技巧', '高性能', '哈希算法'],
    created_at: '2024-04-02T00:00:00.000Z',
  },
  {
    id: 'bloom-filter',
    title: '位图索引快速判重（布隆过滤器）',
    language: 'Java',
    author: 'Google Guava 团队',
    source: 'Guava BloomFilter 实现简化版',
    summary: '用多个哈希函数操作位图，判断元素是否存在，内存效率极高。',
    code: `boolean mightContain(byte[] buf, int m, int k) {
    BitArray bits = new BitArray(m);
    for (int i = 0; i < k; i++) {
        int hash = MurmurHash3.hash32(buf, i);
        if (!bits.get(Math.abs(hash) % m)) return false;
    }
    return true;
}`,
    analysis: `对输入计算 k 个独立哈希，全部位为 1 时才可能存在，有误判但绝无漏判。
内存只需 m 比特，适合大规模去重。`,
    tags: ['概率数据结构', '空间优化', '哈希设计'],
    created_at: '2024-04-15T00:00:00.000Z',
  },
  {
    id: 'duffs-device',
    title: 'C 语言的 Duff\'s Device',
    language: 'C',
    author: 'Tom Duff',
    source: '邮件列表, 1983',
    summary: '将 switch 和 do-while 交织，实现循环展开的极限优化。',
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
    analysis: `通过 switch 跳转到循环内对应剩余次数的 case，然后一个 do-while 完成批量复制。
减少了循环条件判断次数，显著提升内存拷贝速度。`,
    tags: ['循环展开', '编译器合作', '奇技淫巧'],
    created_at: '2024-04-28T00:00:00.000Z',
  },
  {
    id: 'elixir-parser',
    title: '利用尾递归优化解析器',
    language: 'Elixir',
    author: 'José Valim',
    source: 'Elixir 标准库解析器',
    summary: '用尾递归和模式匹配构建低开销的 Token 解析循环。',
    code: `defp parse_tokens(<<>>, acc), do: Enum.reverse(acc)
defp parse_tokens(<<char, rest::binary>>, acc) when char in ?0..?9 do
    {num, rest2} = parse_integer(rest, char - ?0)
    parse_tokens(rest2, [{:int, num} | acc])
end
defp parse_tokens(<<char, rest::binary>>, acc) do
    parse_tokens(rest, [{:op, char} | acc])
end`,
    analysis: `每次只匹配头部一个字符，立即分解任务而不用维护额外状态机。
尾调用优化使递归不消耗栈空间。`,
    tags: ['函数式编程', '解析器设计', '尾递归优化'],
    created_at: '2024-05-05T00:00:00.000Z',
  },
  {
    id: 'kfifo',
    title: 'Linux 内核的循环缓冲区 kfifo',
    language: 'C',
    author: '内核社区',
    source: 'include/linux/kfifo.h',
    summary: '利用无符号整数溢出和内存屏障构建无锁循环队列。',
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
    analysis: `通过内存屏障保证写入顺序，无符号索引自然回绕，取模运算被与运算替代。
等待循环用 cpu_relax 降低功耗。`,
    tags: ['无锁编程', '内存屏障', '内核技巧'],
    created_at: '2024-05-18T00:00:00.000Z',
  },
  {
    id: 'python-with',
    title: 'Python 的 with 上下文管理器实现',
    language: 'Python',
    author: 'Guido van Rossum',
    source: 'CPython 中 contextlib.contextmanager',
    summary: '用生成器函数的 yield 分割前置和后置逻辑，简化资源管理。',
    code: `from contextlib import contextmanager
@contextmanager
def open_file(name, mode):
    f = open(name, mode)
    try:
        yield f
    finally:
        f.close()`,
    analysis: `yield 之前的代码是 __enter__，之后的代码是 __exit__，即使异常也能执行清理。
装饰器将生成器协议与传统类实现统一。`,
    tags: ['语言特性', '资源管理', '代码模式'],
    created_at: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'redis-sds',
    title: 'Redis 的 sds 动态字符串',
    language: 'C',
    author: 'Salvatore Sanfilippo',
    source: 'Redis sds.h',
    summary: '在 C 字符串头部附加长度信息，实现 O(1) 取长度和高效扩容。',
    code: `struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len;
    uint8_t alloc;
    unsigned char flags;
    char buf[];
};
static inline size_t sdslen(const sds s) {
    return ((struct sdshdr8 *)(s - 1))->len;
}`,
    analysis: `将元数据存储在返回指针前方，利用指针算术无额外开销。
同时记录已分配空间，避免反复 realloc。`,
    tags: ['内存管理', '数据结构', '嵌入式元信息'],
    created_at: '2024-06-12T00:00:00.000Z',
  },
  {
    id: 'quicksort-3way',
    title: '快速排序的三向切分',
    language: 'C',
    author: 'Bentley & McIlroy',
    source: '"Engineering a Sort Function"',
    summary: '将数组分成小于、等于、大于三部分，对包含大量重复的数组近乎线性。',
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
    analysis: `将等于 pivot 的元素收集到两端，最后归位，中间段不再处理。
对重复键极多的数据可达到 O(n) 时间。`,
    tags: ['排序算法', '重复数据优化', '经典实现'],
    created_at: '2024-06-26T00:00:00.000Z',
  },
  {
    id: 'zero-length-array',
    title: '零长度数组实现变长结构体',
    language: 'C',
    author: '内核开发者',
    source: 'Linux 网络缓冲区 sk_buff',
    summary: '在结构体末尾声明零长度数组，一次分配获得结构体和动态缓冲区。',
    code: `struct msg {
    uint32_t len;
    char data[];
};
struct msg *m = malloc(sizeof(*m) + payload_len);
m->len = payload_len;
memcpy(m->data, buf, payload_len);`,
    analysis: `数组不占空间，但可作为首地址使用，分配时只需计算偏移。
避免二次分配和指针分离，提高缓存局部性。`,
    tags: ['内存打包', '数据结构', '性能'],
    created_at: '2024-07-08T00:00:00.000Z',
  },
  {
    id: 'sync-once',
    title: 'Go 的同步原语 sync.Once',
    language: 'Go',
    author: 'Go 团队',
    source: 'sync/once.go',
    summary: '用原子操作 + 互斥锁实现函数仅执行一次，最小化快速路径开销。',
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
    analysis: `快速路径只用一次原子读取，无锁竞争。
慢路径双重检查，保证并发安全且仅执行一次。`,
    tags: ['并发控制', '原子操作', '设计模式'],
    created_at: '2024-07-21T00:00:00.000Z',
  },
  {
    id: 'bit-reverse',
    title: '位反转的奇技',
    language: 'C',
    author: '未知 (Bit Twiddling Hacks)',
    source: 'graphics.stanford.edu/~seander/bithacks.html',
    summary: '通过分治掩码交换比特，15 次操作完成 32 位整数的位反转。',
    code: `unsigned int reverse(unsigned int x) {
    x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
    x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
    x = ((x >> 4) & 0x0F0F0F0F) | ((x & 0x0F0F0F0F) << 4);
    x = ((x >> 8) & 0x00FF00FF) | ((x & 0x00FF00FF) << 8);
    x = ( x >> 16 ) | ( x << 16 );
    return x;
}`,
    analysis: `每步交换相邻的 1、2、4、8、16 位对，合并后即完成整体反转。
无分支，可流水线高效执行。`,
    tags: ['位运算技巧', '分治', '无分支编程'],
    created_at: '2024-08-04T00:00:00.000Z',
  },
  {
    id: 'do-while-0',
    title: 'C 语言 do{...}while(0) 宏保护',
    language: 'C',
    author: '内核社区',
    source: 'Linux 内核各类宏',
    summary: '允许多语句宏安全地出现在 if-else 等结构中，且强制分号。',
    code: `#define LOG(msg, ...) \\
    do { \\
        fprintf(stderr, "[%s:%d] " msg, __FILE__, __LINE__, ##__VA_ARGS__); \\
    } while(0)`,
    analysis: `do{...}while(0) 是一个语句块，能被 if-else 正确配对。
末尾 while(0) 要求调用者添加分号，符合语句习惯。`,
    tags: ['预处理器技巧', '防御性编程', '宏安全'],
    created_at: '2024-08-19T00:00:00.000Z',
  },
  {
    id: 'unsigned-sub',
    title: '无符号减法做饱和运算（TCP 序号比较）',
    language: 'C',
    author: '很多网络协议栈',
    source: 'TCP 序列号比较',
    summary: '使用无符号减法的自然回绕判断时序先后，避免单次比较的溢出问题。',
    code: `/* Return true if seq1 < seq2 */
int before(unsigned int seq1, unsigned int seq2) {
    return (int)(seq1 - seq2) < 0;
}`,
    analysis: `无符号差转为有符号比较，自动处理 32 位回绕。
极大简化滑动窗口协议的状态判断。`,
    tags: ['溢出利用', '协议设计', '位运算'],
    created_at: '2024-09-02T00:00:00.000Z',
  },
  {
    id: 'select-timeout',
    title: '利用 select 实现超时重试',
    language: 'Python',
    author: '社区常用模式',
    source: '网络库中常见',
    summary: '在 socket 上设置超时并等待可写可读，简洁实现带超时的网络操作。',
    code: `import select
def send_timeout(sock, data, timeout=5):
    _, wlist, _ = select.select([], [sock], [], timeout)
    if wlist:
        return sock.send(data)
    raise TimeoutError()`,
    analysis: `select 阻塞等待直至 socket 可写或超时，单次调用完成等待和判断。
避免手动轮询和复杂的定时器管理。`,
    tags: ['网络编程', '超时模式', '系统调用复用'],
    created_at: '2024-09-15T00:00:00.000Z',
  },
];

const tags = [
  { id: '位运算技巧', name: '位运算技巧' },
  { id: '浮点黑魔法', name: '浮点黑魔法' },
  { id: '性能优化', name: '性能优化' },
  { id: '宏技巧', name: '宏技巧' },
  { id: '数据结构', name: '数据结构' },
  { id: '侵入式设计', name: '侵入式设计' },
  { id: '概率数据结构', name: '概率数据结构' },
  { id: '对数复杂度', name: '对数复杂度' },
  { id: '高效搜索', name: '高效搜索' },
  { id: '无锁编程', name: '无锁编程' },
  { id: '内存模型', name: '内存模型' },
  { id: '高性能', name: '高性能' },
  { id: '设计模式', name: '设计模式' },
  { id: '惰性求值', name: '惰性求值' },
  { id: '语言特性妙用', name: '语言特性妙用' },
  { id: '测试技巧', name: '测试技巧' },
  { id: '资源管理', name: '资源管理' },
  { id: '调试', name: '调试' },
  { id: '哈希算法', name: '哈希算法' },
  { id: '空间优化', name: '空间优化' },
  { id: '哈希设计', name: '哈希设计' },
  { id: '循环展开', name: '循环展开' },
  { id: '编译器合作', name: '编译器合作' },
  { id: '奇技淫巧', name: '奇技淫巧' },
  { id: '函数式编程', name: '函数式编程' },
  { id: '解析器设计', name: '解析器设计' },
  { id: '尾递归优化', name: '尾递归优化' },
  { id: '内存屏障', name: '内存屏障' },
  { id: '内核技巧', name: '内核技巧' },
  { id: '语言特性', name: '语言特性' },
  { id: '代码模式', name: '代码模式' },
  { id: '内存管理', name: '内存管理' },
  { id: '嵌入式元信息', name: '嵌入式元信息' },
  { id: '排序算法', name: '排序算法' },
  { id: '重复数据优化', name: '重复数据优化' },
  { id: '经典实现', name: '经典实现' },
  { id: '内存打包', name: '内存打包' },
  { id: '性能', name: '性能' },
  { id: '并发控制', name: '并发控制' },
  { id: '原子操作', name: '原子操作' },
  { id: '分治', name: '分治' },
  { id: '无分支编程', name: '无分支编程' },
  { id: '预处理器技巧', name: '预处理器技巧' },
  { id: '防御性编程', name: '防御性编程' },
  { id: '宏安全', name: '宏安全' },
  { id: '溢出利用', name: '溢出利用' },
  { id: '协议设计', name: '协议设计' },
  { id: '网络编程', name: '网络编程' },
  { id: '超时模式', name: '超时模式' },
  { id: '系统调用复用', name: '系统调用复用' },
];

export { snippets, tags };