import * as React from 'react';
import { PageHeader, Button, Layout } from '@arco-design/web-react';

export function LayoutWrap(props: any) {
  return (
    <Layout style={{ height: '100%' }}>
      <PageHeader
        style={{ background: 'var(--color-bg-2)', borderBottom: '1px solid #eee' }}
        title="VChart Video"
        subTitle="every word, every story"
        extra={
          <div>
            <Button shape="round" type="primary">
              sign in with google
            </Button>
          </div>
        }
      />
      {props.children}
    </Layout>
  );
}
