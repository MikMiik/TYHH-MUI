# AI Development Guidelines

## Triết lý phát triển

### KISS Principle (Keep It Simple, Stupid)

- **Ưu tiên giải pháp đơn giản** trước khi nghĩ đến tối ưu phức tạp
- **Tránh over-engineering**: Không tạo ra hệ thống phức tạp không cần thiết
- **Code dễ hiểu > Code "thông minh"**: Viết code mà junior dev có thể đọc và maintain

### Anti Over-Engineering Patterns

- ❌ **Tránh cache khi chưa cần thiết**: Chỉ cache khi có bằng chứng performance issue
- ❌ **Tránh microservices sớm**: Monolith đầu tiên, tách sau khi cần scale
- ❌ **Tránh abstraction sớm**: DRY khi có 3+ cases giống nhau, không phải 2
- ❌ **Tránh design patterns phức tạp**: Factory, Observer, Strategy chỉ khi thực sự cần

## Quy tắc làm việc với AI

### 1. Phân tích yêu cầu

- **Hỏi "Tại sao?"** trước khi code: Mục đích thực sự là gì?
- **Định nghĩa "Đủ tốt"**: Performance/features ở mức nào là acceptable?
- **Ước lượng scale**: 100 users? 10k? 1M? Thiết kế phù hợp

### 2. Approach giải quyết vấn đề

```
1. Giải pháp đơn giản nhất có thể
2. Test xem có work không
3. Measure performance nếu cần
4. Optimize chỉ khi có bottleneck thực sự
5. Refactor khi code khó maintain
```

### 3. Code Quality Standards

- **Readable > Clever**: `getUserById()` thay vì `u()`
- **Explicit > Implicit**: Khai báo rõ ràng thay vì magic numbers/strings
- **Error handling**: Always handle errors, log properly
- **Comments**: Giải thích "tại sao", không phải "cái gì"

### 4. Performance Philosophy

- **Measure first**: Không optimize khi chưa đo được bottleneck
- **80/20 rule**: 80% performance từ 20% effort đầu tiên
- **User experience**: 200ms response time > 50ms với code phức tạp
- **Database**: Index đúng chỗ > Query optimization phức tạp

### 5. Testing Strategy

- **Manual test first**: Click through features trước khi viết unit test
- **Test happy path**: 80% cases thành công trước edge cases
- **Integration > Unit**: Test flow hoàn chỉnh quan trọng hơn test từng function

## Communication với Developer

### 1. Đề xuất giải pháp

```markdown
## Vấn đề:

[Mô tả vấn đề cụ thể]

## Giải pháp đơn giản:

[Approach đơn giản nhất]

## Giải pháp phức tạp (nếu cần):

[Chỉ khi simple solution không đủ]

## Trade-offs:

- Pros: ...
- Cons: ...
- Khi nào nên upgrade: ...
```

### 2. Code Implementation

- **Small commits**: Mỗi commit 1 feature/fix nhỏ
- **Explain changes**: Tại sao thay đổi, không phải thay đổi gì
- **Show alternatives**: Đã consider approaches nào khác

### 3. Khi nào từ chối yêu cầu

- Yêu cầu tạo ra unnecessary complexity
- Performance optimization premature
- Features không có clear business value
- Architecture changes không có migration plan

## Red Flags - Khi nào cần dừng lại

### Technical Red Flags

- Code > 100 lines để solve 1 simple problem
- Cần > 3 new dependencies cho 1 feature
- Configuration file > actual code
- "Framework" cho 1 specific use case

### Process Red Flags

- Không test được manual trong < 5 phút
- Cần documentation > 1 page để explain
- Junior dev không hiểu được sau 10 phút đọc code
- Rollback strategy không rõ ràng

## Best Practices theo kinh nghiệm

### Database

- **Index dựa trên query patterns thực tế**, không phải guess work
- **Pagination simple**: LIMIT/OFFSET trước, cursor-based khi cần
- **Transactions**: Chỉ khi thực sự cần ACID, không phải mọi operations

### API Design

- **REST đầu tiên**: GraphQL khi có evidence của N+1 problems
- **JSON response**: Consistent structure, error handling rõ ràng
- **Rate limiting**: Simple IP-based trước, sophisticated sau

### Frontend

- **Component reuse**: 3+ times rule trước khi extract common component
- **State management**: Local state → Context → Redux/Zustand
- **CSS**: Tailwind/styled-components over complex CSS architecture

### Security

- **Authentication**: JWT simple trước, sessions khi cần stateful
- **Authorization**: Role-based đầu tiên, permissions khi thực sự phức tạp
- **Input validation**: Server-side mandatory, client-side for UX

## Decision Framework

Khi đối mặt với choice A vs B:

```
1. Which is simpler to implement?
2. Which is easier to debug?
3. Which has fewer dependencies?
4. Which is easier to test?
5. Which has clearer rollback plan?

Chọn option thắng nhiều criteria hơn.
```

## Metrics thành công

### Code Quality

- Time to onboard new dev < 1 day
- Bug fix time < 2 hours average
- Feature development predictable timeline

### Performance

- Page load < 2s on 3G
- API response < 500ms p95
- Database queries < 100ms average

### Maintenance

- Deployment frequency: daily possible
- Rollback time < 5 minutes
- Zero-config local development setup

---

**Remember**: Code is read 10x more than written. Optimize for reading, not writing.
