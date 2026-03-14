// Базовый интерфейс для любого блока
interface BaseBlock {
  id: string;
}

// Блок параграфа
interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  data: {
    text: string;
  };
}

// Блок заголовка
interface HeaderBlock extends BaseBlock {
  type: 'Header'; // В вашем JSON 'Header' с большой буквы
  data: {
    text: string;
    level: number;
  };
}

// Элемент списка (может быть вложенным)
interface ListItem {
  content: string;
  meta: {
    checked?: boolean;
    counterType?: string;
  };
  items: ListItem[];
}

// Блок списка (unordered, ordered, checklist)
interface ListBlock extends BaseBlock {
  type: 'List';
  data: {
    style: 'unordered' | 'ordered' | 'checklist';
    items: ListItem[];
    meta?: Record<string, any>;
  };
}

// Объединяем все возможные типы блоков
type EditorBlock = ParagraphBlock | HeaderBlock | ListBlock;

// Итоговая структура JSON
export interface EditorJSData {
  time?: number;
  version?: string;
  blocks?: EditorBlock[];
}
