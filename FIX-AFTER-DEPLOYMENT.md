# Post-Deployment Fixes

This document outlines the steps to properly fix the ESLint warnings that were bypassed for the initial deployment.

## Image Component Fixes

Replace `<img>` tags with Next.js `<Image>` components in these files:

1. `src/app/page.tsx` (line 86)
2. `src/app/search/page.tsx` (lines 99 and 205)
3. `src/components/SignInWithGoogle.tsx` (line 13)
4. `src/app/blog/[slug]/page.tsx`

Example conversion:

```jsx
// FROM:
<img
  src={post.cover_image}
  alt={post.title}
  className="w-full h-full object-cover"
/>;

// TO:
import Image from "next/image";

<Image
  src={post.cover_image}
  alt={post.title}
  width={600}
  height={400}
  className="w-full h-full object-cover"
  priority={true} // For important above-the-fold images
/>;
```

## React Hook Dependency Fixes

1. `src/components/admin/PostForm.tsx` (line 47):

   - Add `formData` to the dependency array:

   ```jsx
   useEffect(() => {
     // Your existing code
   }, [formData /* other dependencies */]);
   ```

2. `src/lib/contexts/SupabaseAuthContext.tsx` (line 79):

   - Remove `router` from the dependency array if it doesn't need to trigger the callback.

3. `src/lib/hooks/useSupabaseAuth.ts` (line 79):
   - Remove `isUsingMockSupabase` and `supabase` from the dependency array.

## Final Steps

1. After implementing these fixes, update `next.config.js` to remove these lines:

   ```js
   eslint: {
     ignoreDuringBuilds: true,
   },
   typescript: {
     ignoreBuildErrors: true,
   }
   ```

2. Run ESLint locally to ensure all issues are fixed:

   ```bash
   npm run lint
   ```

3. Test the application locally:

   ```bash
   npm run build
   npm start
   ```

4. Commit and push changes to trigger a new Vercel deployment with proper ESLint checks enabled.
