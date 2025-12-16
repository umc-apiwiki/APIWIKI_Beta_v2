# Next.js Development Guidelines

## Code Organization & Maintainability

### File Structure
- **Keep files focused and modular**: Each file should have a single, clear responsibility
- **Split large files**: If a file exceeds 200 lines, consider breaking it into smaller modules
- **Organize by feature**: Group related components, hooks, and utilities together
- **Use barrel exports**: Create index files to simplify imports and manage public APIs

### Code Reusability
- **Check existing code first**: Before creating new functions or components, search the codebase for similar implementations
- **Extract common patterns**: If code is used 3+ times, extract it into a shared utility or component
- **Use composition**: Prefer composing smaller components over creating large monolithic ones
- **Document shared utilities**: Add clear comments explaining parameters, return values, and usage examples

### File Organization Example
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layouts/      # Layout components
├── lib/
│   ├── api/          # API client functions
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── validations/  # Zod schemas
├── app/
│   ├── api/          # API routes
│   └── (routes)/     # Page routes
```

## Performance Optimization

### Data Fetching
- **Minimize API calls**: Fetch data at the highest necessary level and pass down via props
- **Use React Server Components**: Fetch data server-side when possible to reduce client bundle
- **Implement caching**: Use Next.js cache, React cache(), or SWR/React Query for client-side caching
- **Parallel data fetching**: Use Promise.all() for independent data requests

### Database Optimization
- **Batch queries**: Combine multiple database calls into single queries when possible
- **Use select statements**: Only fetch required columns, avoid SELECT *
- **Implement pagination**: Never fetch unbounded data sets
- **Add database indexes**: Index frequently queried columns

### Performance Example
```typescript
// ❌ Bad: Multiple sequential API calls
const user = await getUser(userId);
const posts = await getPosts(userId);
const comments = await getComments(userId);

// ✅ Good: Parallel fetching
const [user, posts, comments] = await Promise.all([
  getUser(userId),
  getPosts(userId),
  getComments(userId)
]);

// ✅ Better: Single optimized query
const userData = await getUserWithPostsAndComments(userId);
```

## Security Best Practices

### Client vs Server Separation
- **Server-side validation**: ALWAYS validate user input on the server, never trust client-side validation alone
- **Use Server Actions**: Perform mutations via Server Actions, not exposed API routes when possible
- **Protect API routes**: Implement authentication middleware for all sensitive endpoints
- **Environment variables**: Use NEXT_PUBLIC_ prefix only for truly public values

### Input Validation
- **Validate everything**: Use Zod or similar libraries to validate all user inputs
- **Sanitize data**: Clean user input before storing or displaying (prevent XSS)
- **Rate limiting**: Implement rate limiting for API routes and form submissions
- **CSRF protection**: Use tokens for state-changing operations

### Authentication & Authorization
- **Verify user identity**: Check authentication on every protected route and API endpoint
- **Implement RBAC**: Check user permissions before allowing operations
- **Secure session management**: Use httpOnly, secure cookies with proper expiration
- **Hash passwords**: Use bcrypt or similar with proper salt rounds (minimum 10)

### Security Example
```typescript
// ❌ Bad: Trusting client-side data
export async function POST(request: Request) {
  const { userId, isAdmin } = await request.json();
  if (isAdmin) {
    // Dangerous: client can claim to be admin
  }
}

// ✅ Good: Server-side verification
export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const user = await db.user.findUnique({ 
    where: { id: session.userId } 
  });
  
  if (user.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }
  // Proceed with admin operation
}
```

## Logging & Monitoring

### Error Logging
- **Wrap critical operations**: Use try-catch blocks for all async operations
- **Log with context**: Include relevant metadata (userId, operation, timestamp)
- **Use structured logging**: Maintain consistent log format for parsing
- **Capture to monitoring service**: Send errors to Sentry/GlitchTip
- **Log messages in Korean**: Write all log messages in Korean for team consistency

### Event Tracking
- **Track user actions**: Log significant user interactions (signup, purchase, feature usage)
- **Include event metadata**: Add relevant context to analytics events
- **Track performance metrics**: Log slow operations, API response times
- **Privacy compliance**: Never log sensitive data (passwords, tokens, PII)

### Logging Example
```typescript
// ❌ Bad: Silent failure
try {
  await updateUser(userId, data);
} catch (error) {
  // Error swallowed
}

// ✅ Good: Proper error handling with Korean logs
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

try {
  await updateUser(userId, data);
  
  logger.info('사용자 정보 업데이트 성공', {
    userId,
    changedFields: Object.keys(data),
    timestamp: new Date().toISOString()
  });
  
  // Track in analytics
  gaEvent({
    action: 'user_updated',
    category: 'user_management',
    label: userId
  });
  
} catch (error) {
  logger.error('사용자 정보 업데이트 실패', {
    userId,
    error: error.message,
    stack: error.stack,
    context: '사용자 프로필 수정 중 데이터베이스 오류 발생'
  });
  
  Sentry.captureException(error, {
    tags: { operation: 'user_update' },
    user: { id: userId }
  });
  
  throw error;
}
```

### Log Message Guidelines
- **Use Korean for all log messages**: info, warn, error messages should be in Korean
- **Include context**: Add helpful details about what was happening when the log was created
- **Be specific**: Instead of "작업 실패", write "사용자 등급 업데이트 중 데이터베이스 연결 실패"
- **Use consistent patterns**: Maintain similar structure across log messages

### Log Pattern Examples
```typescript
// Success logs
logger.info('API 등록 요청 접수 완료', { apiId, userId });
logger.info('게시글 작성 성공', { postId, boardType, authorId });
logger.info('위키 문서 편집 저장 완료', { apiId, editorId, changeSize });

// Warning logs
logger.warn('API 응답 시간 임계값 초과', { endpoint, duration, threshold: 500 });
logger.warn('사용자 일일 편집 한도 근접', { userId, currentEdits: 45, limit: 50 });

// Error logs
logger.error('데이터베이스 연결 실패', { error: error.message, retryCount });
logger.error('외부 API 호출 타임아웃', { apiUrl, timeout: 5000 });
logger.error('파일 업로드 실패', { fileName, fileSize, error: error.message });
```

## Code Documentation

### Comments in Korean
- **Explain "why" not "what"**: Focus on business logic and decision reasoning
- **Document complex algorithms**: Add step-by-step explanations for non-obvious code
- **Add function documentation**: Document parameters, return values, and side effects
- **Warn about pitfalls**: Note edge cases or potential issues
- **All comments must be in Korean**: Maintain consistency across the codebase

### Comment Example
```typescript
/**
 * 사용자 등급을 계산하고 업데이트합니다
 * 
 * @param userId - 업데이트할 사용자 ID
 * @returns 새로운 등급 (bronze | silver | gold)
 * 
 * 등급 계산 기준:
 * - Bronze: 0-99 포인트
 * - Silver: 100-499 포인트
 * - Gold: 500+ 포인트
 * 
 * 주의: 이 함수는 트랜잭션 내에서 실행되어야 합니다
 */
async function calculateAndUpdateUserGrade(userId: string) {
  // 사용자의 총 활동 점수를 집계합니다
  // UserActivity 테이블의 모든 포인트를 합산
  const totalPoints = await db.userActivity
    .aggregate({
      where: { userId },
      _sum: { points: true }
    });

  // 점수 구간에 따라 등급을 결정합니다
  // 비즈니스 요구사항: 등급은 하향 조정되지 않고 상향만 가능
  let newGrade: UserGrade;
  if (totalPoints._sum.points >= 500) {
    newGrade = 'gold';
  } else if (totalPoints._sum.points >= 100) {
    newGrade = 'silver';
  } else {
    newGrade = 'bronze';
  }

  // 데이터베이스에 새 등급을 저장합니다
  const user = await db.user.update({
    where: { id: userId },
    data: { 
      grade: newGrade,
      gradeUpdatedAt: new Date() // 등급 변경 시각 기록
    }
  });

  // 등급 변경 이력을 로깅합니다
  logger.info('사용자 등급 업데이트 완료', {
    userId,
    이전등급: user.grade,
    새등급: newGrade,
    총포인트: totalPoints._sum.points,
    변경시각: new Date().toISOString()
  });

  // 등급 변경 이벤트를 분석 시스템에 전송합니다
  gaEvent({
    action: 'grade_updated',
    category: 'user_progression',
    label: `${user.grade} -> ${newGrade}`,
    value: totalPoints._sum.points
  });

  return newGrade;
}
```

### Inline Comment Guidelines
```typescript
// ✅ Good: Explains business logic
// 관리자는 모든 API를 즉시 승인 없이 등록할 수 있습니다
if (user.role === 'admin') {
  apiStatus = 'approved';
}

// ✅ Good: Warns about edge case
// 주의: 비회원 댓글은 author_id가 null이므로 author_name으로 표시해야 합니다
const authorDisplay = comment.author_id 
  ? comment.author.name 
  : comment.author_name;

// ✅ Good: Explains performance decision
// 성능 최적화: 관련 데이터를 한 번에 가져와 N+1 쿼리를 방지합니다
const apis = await db.api.findMany({
  include: {
    creator: true,
    reviews: true,
    _count: { select: { reviews: true } }
  }
});

// ❌ Bad: States the obvious
// 사용자를 가져옵니다
const user = await getUser(userId);
```

## Code Quality Checklist

Before submitting code, verify:
- [ ] No duplicate code - checked existing utilities/components
- [ ] Optimized data fetching - minimal API calls, proper caching
- [ ] Server-side validation - all user inputs validated
- [ ] Proper authentication - protected routes checked
- [ ] Error handling - try-catch with Korean logging
- [ ] Event tracking - important actions logged in Korean
- [ ] Korean comments - complex logic explained in Korean
- [ ] File size reasonable - <200 lines per file
- [ ] Security reviewed - no sensitive data exposed
- [ ] Performance considered - no N+1 queries

## Additional Best Practices

### TypeScript Usage
- **Use strict types**: Enable strict mode in tsconfig.json
- **Avoid any**: Use unknown or proper types instead
- **Define interfaces**: Create clear interfaces for data structures
- **Use generics**: For reusable utility functions

### Error Handling Patterns
```typescript
// ✅ Good: Specific error handling
try {
  await createPost(data);
} catch (error) {
  if (error instanceof ValidationError) {
    logger.warn('게시글 검증 실패', { errors: error.errors });
    return { error: '입력값을 확인해주세요' };
  }
  
  if (error instanceof DatabaseError) {
    logger.error('게시글 저장 중 데이터베이스 오류', { error: error.message });
    Sentry.captureException(error);
    return { error: '일시적인 오류가 발생했습니다' };
  }
  
  // Unknown error
  logger.error('게시글 생성 중 예상치 못한 오류', { error });
  Sentry.captureException(error);
  throw error;
}
```

### API Response Format
```typescript
// ✅ Consistent response structure
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Success response
return Response.json({
  success: true,
  data: { user, token },
  message: '로그인 성공'
});

// Error response
return Response.json({
  success: false,
  error: 'INVALID_CREDENTIALS',
  message: '이메일 또는 비밀번호가 올바르지 않습니다'
}, { status: 401 });
```