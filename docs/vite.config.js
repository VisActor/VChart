import pkg from '../packages/vchart/package.json';
import * as path from 'path';
import react from '@vitejs/plugin-react';

export default {
  optimizeDeps: {},
  server: {
    host: '0.0.0.0',
    port: 3020,
    https: !!process.env.HTTPS,
    open: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve('../packages/vchart/src/index.ts'),
      '@visactor/vchart-extension': path.resolve('../packages/vchart-extension/src/index.ts'),
      '@visactor/react-vchart': path.resolve('../packages/react-vchart/src/index.ts'),
      '@visactor/openinula-vchart': path.resolve('../packages/openinula-vchart/src/index.ts'),
      '@visactor/vutils-extension': path.resolve('../packages/vutils-extension/src/index.ts'),
      '@internal/story-player': path.resolve('../tools/story-player/src/index.ts'),
      '@visactor/vgrammar-core': '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-core/src/index.ts',
      '@visactor/vgrammar-util': '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-util/src/index.ts',
      '@visactor/vgrammar-wordcloud':
        '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-wordcloud/src/index.ts',
      '@visactor/vgrammar-wordcloud-shape':
        '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-wordcloud-shape/src/index.ts',
      '@visactor/vgrammar-sankey':
        '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-sankey/src/index.ts',
      '@visactor/vgrammar-hierarchy':
        '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-hierarchy/src/index.ts',
      '@visactor/vgrammar-projection':
        '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-projection/src/index.ts',
      '@visactor/vgrammar-coordinate':
        '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-coordinate/src/index.ts',
      '@visactor/vgrammar-venn': '/Users/bytedance/Documents/opensource/vgrammar/packages/vgrammar-venn/src/index.ts',
      '@visactor/vrender-core': '/Users/bytedance/Documents/opensource/VRender/packages/vrender-core/src/index.ts',
      '@visactor/vrender-kits': '/Users/bytedance/Documents/opensource/VRender/packages/vrender-kits/src/index.ts',
      '@visactor/vrender-components':
        '/Users/bytedance/Documents/opensource/VRender/packages/vrender-components/src/index.ts',
      '@visactor/vscale': '/Users/bytedance/Documents/opensource/vutil/packages/vscale/src/index.ts',
      '@visactor/vdataset': '/Users/bytedance/Documents/opensource/vutil/packages/vdataset/src/index.ts',
      '@visactor/vutils': '/Users/bytedance/Documents/opensource/vutil/packages/vutils/src/index.ts'
    }
  },
  plugins: [react()]
};
