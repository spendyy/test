import { JSX } from 'react';
import { EditorJSData } from './@types/types';

interface EditorParserProps {
  data: EditorJSData;
}

export default function EditorParser({ data }: EditorParserProps) {
  if (!data || !data.blocks) return null;

  return (
    <div className="editor-content prose max-w-none">
      {data.blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={block.id}
                className="mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );

          case 'Header': {
            const HeaderTag =
              `h${block.data.level}` as keyof JSX.IntrinsicElements;

            const headerClasses: Record<number, string> = {
              1: 'text-4xl font-bold mb-6',
              2: 'text-3xl font-semibold mb-4',
              3: 'text-2xl font-medium mb-3',
            };

            return (
              <HeaderTag
                key={block.id}
                className={headerClasses[block.data.level] || 'text-xl'}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          }

          case 'List':
            const isOrdered = block.data.style === 'ordered';
            const isChecklist = block.data.style === 'checklist';
            const ListTag = isOrdered ? 'ol' : 'ul';

            return (
              <ListTag
                key={block.id}
                className={`mb-4 space-y-2 ${
                  isChecklist
                    ? 'list-none ml-0'
                    : isOrdered
                      ? 'list-decimal ml-8 marker:text-black marker:font-bold'
                      : 'list-disc ml-8 marker:text-black marker:text-lg'
                }`}
              >
                {block.data.items.map((item: any, index: number) => (
                  <li
                    key={index}
                    className={`${isChecklist ? 'flex items-start' : 'pl-2'}`}
                  >
                    {isChecklist ? (
                      <>
                        <input
                          type="checkbox"
                          checked={item.meta?.checked}
                          readOnly
                          className="mt-1.5 mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span
                          className={
                            item.meta?.checked
                              ? 'line-through text-gray-400'
                              : 'text-black'
                          }
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </>
                    ) : (
                      <span
                        className="text-black"
                        dangerouslySetInnerHTML={{
                          __html: item.content || item,
                        }}
                      />
                    )}
                  </li>
                ))}
              </ListTag>
            );

          default:
            console.warn('Unsupported block type:', block);
            return null;
        }
      })}
    </div>
  );
}
