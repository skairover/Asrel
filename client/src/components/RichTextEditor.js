// components/RichTextEditor.js
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleEditorChange = (content) => {
    onChange(content);
    
    // Calculate word and character count
    if (editorRef.current) {
      const text = editorRef.current.getContent({ format: 'text' });
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    }
  };

  const handleImageUpload = (blobInfo, progress) => new Promise((resolve, reject) => {
    // Simulate image upload - replace with your actual upload logic
    setTimeout(() => {
      progress(100);
      // In a real application, you would upload to your server and get a URL
      const mockImageUrl = `https://picsum.photos/800/400?random=${Math.random()}`;
      resolve(mockImageUrl);
    }, 2000);
  });

  const customButton = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mceInsertContent', false, '<!-- Inserted custom content -->');
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      overflow: 'hidden' ,
    }}>
      <Editor
        apiKey="kqx7njnj2lg8cu0u3xsmmubmcp66qn97dd4kq71ecd6w53ic"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen', 'emoticons',
            'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount',
            'codesample', 'directionality', 'pagebreak', 'nonbreaking', 'template', 'hr'
          ],
          toolbar: `undo redo | formatselect | bold italic underline strikethrough | 
                   forecolor backcolor | alignleft aligncenter alignright alignjustify | 
                   bullist numlist outdent indent | link image media | 
                   codesample code | emoticons | table hr pagebreak nonbreaking | 
                   fontselect fontsizeselect | blockquote superscript subscript | 
                   removeformat | fullscreen preview | help`,
          fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt',
          content_style: `
            
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
              font-size: 16px; 
              line-height: 1.6;
              color: #333;
            }
            h1 { font-size: 2.5em; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
            h2 { font-size: 2em; color: #34495e; }
            h3 { font-size: 1.5em; color: #7f8c8d; }
            blockquote { 
              border-left: 4px solid #3498db; 
              padding-left: 1em; 
              margin-left: 0; 
              color: #555; 
              font-style: italic;
              background-color: #f9f9f9;
              padding: 1em;
              border-radius: 0 4px 4px 0;
            }
            code { 
              background-color: #f5f5f5; 
              padding: 0.2em 0.4em; 
              border-radius: 3px; 
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
            }
            pre { 
              background-color: #f8f8f8; 
              padding: 1em; 
              border-radius: 5px; 
              overflow-x: auto; 
            }
            pre code { background: none; padding: 0; }
          `,
          images_upload_handler: handleImageUpload,
          image_advtab: true,
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          link_context_toolbar: true,
          link_assume_external_targets: true,
          link_target_list: [
            { title: 'Same window', value: '_self' },
            { title: 'New window', value: '_blank' }
          ],
          table_default_styles: {
            width: '100%',
            borderCollapse: 'collapse'
          },
          table_appearance_options: false,
          table_advtab: false,
          table_cell_advtab: false,
          table_row_advtab: false,
          emoticons_database: 'emojis',
          emoticons_append: {
            custom_mind_explode: {
              keywords: ['brain', 'mind', 'explode', 'blown'],
              char: '🤯'
            }
          },
          templates: [
            {
              title: 'Two Column Layout',
              description: 'Adds a two column layout',
              content: `
                <div style="display: flex; gap: 20px; margin: 20px 0;">
                  <div style="flex: 1; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <h3>Left Column</h3>
                    <p>Add your content here...</p>
                  </div>
                  <div style="flex: 1; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <h3>Right Column</h3>
                    <p>Add your content here...</p>
                  </div>
                </div>
              `
            }
          ],
          setup: (editor) => {
            editor.ui.registry.addButton('customInsertButton', {
              text: 'Insert Custom',
              onAction: customButton
            });
            
            editor.ui.registry.addMenuItem('customMenuItem', {
              text: 'Custom Menu Item',
              onAction: customButton
            });
          },
          init_instance_callback: (editor) => {
            editor.on('keyup', () => {
              const text = editor.getContent({ format: 'text' });
              const words = text.trim().split(/\s+/).filter(word => word.length > 0);
              setWordCount(words.length);
              setCharCount(text.length);
            });
          }
        }}
      />
      
      {/* Statistics Bar */}
      <div style={{
        padding: '10px 15px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        <div>
          Words: <strong>{wordCount}</strong> | 
          Characters: <strong>{charCount}</strong>
        </div>
        <div>
          {wordCount > 0 && (
            <>
              Reading time: ~<strong>{Math.ceil(wordCount / 200)}</strong> min
            </>
          )}
        </div>
      </div>
    </div>
  );
}