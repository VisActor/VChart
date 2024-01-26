import { isValid } from '@visactor/vutils';
import { BaseTooltipModel } from './base-tooltip-model';
import { ContentModel } from './content-model';
import type { ITooltipModelOption } from './interface';
import { TitleModel } from './title-model';
import { defaultContainerStyle } from './style-constants';
import { mergeSpec } from '../../../../../util/spec/merge-spec';
import { DEFAULT_TOOLTIP_Z_INDEX } from '../constant';

export class TooltipModel extends BaseTooltipModel {
  title: TitleModel | null = null;
  content: ContentModel | null = null;

  private _classList: string[];
  private _id: string;

  constructor(option: ITooltipModelOption, classList: string[], id: string) {
    super(option.getContainer(), option, 0);
    this._classList = classList;
    this._id = id;
  }

  setVisibility(visibility: boolean) {
    super.setVisibility(visibility);
    if (!this.product) {
      return;
    }
    const { classList } = this.product;
    if (visibility) {
      classList.add('visible');
    } else {
      classList.remove('visible');
    }
  }

  init(): void {
    const tooltipActual = this._option.getTooltipActual();

    if (!this.product) {
      this._initPanel(this._classList, this._id);
    }

    const { title } = tooltipActual;
    if (title?.visible !== false && isValid(title?.value)) {
      if (!this.title) {
        this._initTitle();
      }
    } else if (this.title) {
      this._releaseTitle();
    }

    const renderContent = tooltipActual.content ?? [];
    if (renderContent.length > 0) {
      if (!this.content) {
        this._initContent();
      }
    } else if (this.content) {
      this._releaseContent();
    }
  }

  private _initPanel(classList?: string[], id?: string) {
    const panel = this.createElement(
      'div',
      classList,
      {
        left: '0',
        top: '0',
        pointerEvents: 'none',
        padding: '12px',
        position: 'absolute',
        zIndex: DEFAULT_TOOLTIP_Z_INDEX,
        fontFamily: 'sans-serif',
        fontSize: '11px',
        borderRadius: '3px',
        borderStyle: 'solid',
        lineHeight: 'initial',
        background: '#fff',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        maxWidth: '100wh',
        maxHeight: '100vh'
      },
      id
    );
    this.product = panel;
  }

  private _initTitle() {
    const title = new TitleModel(this.product!, this._option, 0);
    title.init();
    this.title = title;
    this.children[title.childIndex] = title;
  }

  private _releaseTitle() {
    if (!this.title) {
      return;
    }
    this.title.release();
    delete this.children[this.title.childIndex];
    this.title = null;
  }

  private _initContent() {
    const content = new ContentModel(this.product!, this._option, 1);
    content.init();
    this.content = content;
    this.children[content.childIndex] = content;
  }

  private _releaseContent() {
    if (!this.content) {
      return;
    }
    this.content.release();
    delete this.children[this.content.childIndex];
    this.content = null;
  }

  setStyle(): void {
    const tooltipStyle = this._option.getTooltipStyle();
    super.setStyle(mergeSpec({}, defaultContainerStyle, tooltipStyle.panel));
    Object.values(this.children).forEach(c => c.setStyle());
  }

  setContent() {
    Object.values(this.children).forEach(c => {
      c.setContent();
    });
  }

  release(): void {
    super.release();
    this.title = null;
    this.content = null;
  }
}
