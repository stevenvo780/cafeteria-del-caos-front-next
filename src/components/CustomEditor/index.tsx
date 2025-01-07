/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import EditorCode from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import TemplateSlider from './TemplateSlider';
import { Button } from 'react-bootstrap';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getCSSVariable, colorPalette, CustomEditorProps, BlobInfo } from './types';

const CustomEditor: React.FC<CustomEditorProps> = ({
  content,
  setContent,
  templateType = '',
  height = 500,
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [viewMode, setViewMode] = useState<'editor' | 'html'>('editor');
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setContent(content);
  };

  const handleApplyChanges = () => {
    setContent(editorContent);
  };

  const tinyMCEInit: Record<string, any> = {
    height: height,
    menubar: false,
    plugins: ['link', 'fullscreen', 'help', 'save', 'emoticons'],
    content_css: [
      'dark',
      'bootstrap/dist/css/bootstrap.min.css',
    ],
    toolbar:
      'undo redo | formatselect | bold italic forecolor backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | link | ' +
      'hr | emoticons | fullscreen | customUploadImageButton',
    setup: (editor: any) => {
      editor.ui.registry.addButton('customUploadImageButton', {
        icon: 'upload',
        onAction: () => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.onchange = async (event: any) => {
            const file = event.target.files[0];
            if (file) {
              const storage = getStorage();
              const storageRef = ref(storage, `images/${file.name}`);
              try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                editor.insertContent(`<img src="${downloadURL}" alt="${file.name}" />`);
              } catch (error) {
                console.error('Error al subir la imagen:', error);
              }
            }
          };
          fileInput.click();
        },
      });
    },
    skin: 'oxide-dark',
    content_style: `
      body { 
        font-family: Helvetica, Arial, sans-serif; 
        font-size: 14px; 
        color: ${getCSSVariable('--font-color')}; 
        background-color: ${getCSSVariable('--card-color')}; 
      }
      .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
        color: ${getCSSVariable('--font-color')}; 
        opacity: 0.6;
      }
      .mce-content-body img {
        max-width: 100%;
        height: auto;
      }
      .mce-content-body a {
        color: ${getCSSVariable('--link-color')};
      }
      .mce-content-body a:hover {
        color: ${getCSSVariable('--link-hover')};
      }
    `,
    color_map: colorPalette.flatMap((color) => [color, color]),
    images_upload_handler: (
      blobInfo: BlobInfo,
      success: (url: string) => void,
      failure: (err: string) => void,
      progress?: (percent: number) => void
    ) => {
      success('data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64());
    },
  };


  return (
    <>
      {viewMode === 'editor' ? (
        <TinyMCEEditor
          apiKey='ide9bzali9973f0fmbzusywuxlpp3mxmigqoa07eddfltlrj'
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={editorContent}
          onEditorChange={handleEditorChange}
          init={tinyMCEInit}
        />
      ) : (
        <EditorCode
          value={editorContent}
          onValueChange={(code) => setEditorContent(code)}
          highlight={(code) => Prism.highlight(code, Prism.languages.html, 'html')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            border: `1px solid ${getCSSVariable('--border-color')}`,
            borderRadius: '4px',
            height: `${height}px`,
            overflow: 'auto',
            backgroundColor: getCSSVariable('--card-color'),
            color: getCSSVariable('--font-color'),
          }}
        />
      )}
      <br />
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="primary"
          onClick={() => setViewMode(viewMode === 'editor' ? 'html' : 'editor')}
          size="sm"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = getCSSVariable('--primary-hover');
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = getCSSVariable('--primary-color');
          }}
        >
          {viewMode === 'editor' ? 'Ver HTML' : 'Ver Editor'}
        </Button>
        {viewMode === 'html' && (
          <Button
            variant="success"
            onClick={handleApplyChanges}
            size="sm"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = getCSSVariable('--success-hover');
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = getCSSVariable('--success-color');
            }}
          >
            Aplicar Cambios
          </Button>
        )}
      </div>

      <TemplateSlider
        templateType={templateType || ''}
        onTemplateClick={(templateContent: string) => {
          setEditorContent(templateContent);
          setContent(templateContent);
        }}
      />
    </>
  );
};

export default CustomEditor;
