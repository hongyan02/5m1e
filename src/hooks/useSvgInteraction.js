import { useState, useEffect, useCallback } from 'react';

const useSvgInteraction = (onRectClick) => {
  const [selectedRect, setSelectedRect] = useState(null);
  const [svgDoc, setSvgDoc] = useState(null);

  // 创建透明覆盖层，阻止全局点击事件
  const createOverlay = useCallback((doc, svg) => {
    try {
      const overlay = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
      overlay.setAttribute("width", "100%");
      overlay.setAttribute("height", "100%");
      overlay.setAttribute("fill", "transparent");
      overlay.setAttribute("pointer-events", "all");
      overlay.setAttribute("style", "position:absolute;top:0;left:0;z-index:999;");
      
      if (svg.firstChild) {
        svg.insertBefore(overlay, svg.firstChild);
      } else {
        svg.appendChild(overlay);
      }
    } catch (error) {
      console.error('创建覆盖层时出错:', error);
    }
  }, []);

  // 从矩形元素提取文本内容
  const extractTextContent = useCallback((parentG) => {
    if (!parentG) return '';
    
    try {
      // 尝试从text元素获取
      const textElement = parentG.querySelector('text');
      if (textElement) {
        return textElement.textContent || ''; // 确保返回字符串
      }
      
      // 尝试从foreignObject中获取
      const foreignObject = parentG.querySelector('foreignObject');
      if (foreignObject) {
        // 使用textContent而不是innerHTML
        return foreignObject.textContent || '';
      }
      
      return '';
    } catch (error) {
      console.error('提取文本内容时出错:', error);
      return '';
    }
  }, []);

  // 从矩形元素提取数据属性
  const extractRectData = useCallback((rect, parentG) => {
    const cellId = parentG ? parentG.getAttribute('data-cell-id') : '';
    const textContent = extractTextContent(parentG);
    
    // 只获取必要的自定义数据属性
    const processType = rect.getAttribute('data-process-type') || '';
    const tableName = rect.getAttribute('data-table-name') || '';
    
    return {
      id: rect.id || cellId || '',
      width: Number(rect.width.baseVal.value).toFixed(2),
      height: Number(rect.height.baseVal.value).toFixed(2),
      x: Number(rect.x.baseVal.value).toFixed(2),
      y: Number(rect.y.baseVal.value).toFixed(2),
      fill: rect.getAttribute('fill') || '',
      text: textContent,
      processType,
      tableName,
      attributes: Array.from(rect.attributes).reduce((acc, attr) => {
        if (!['id', 'width', 'height', 'x', 'y', 'fill'].includes(attr.name)) {
          acc[attr.name] = attr.value;
        }
        return acc;
      }, {})
    };
  }, [extractTextContent]);

  // 为矩形元素添加点击事件
  const addClickHandler = useCallback((rect) => {
    if (!rect || rect.nodeType !== 1) return; // 确保是有效的元素节点
    
    try {
      // 使用setAttribute设置样式，而不是直接操作style对象
      rect.setAttribute("style", "position:relative;z-index:1000;cursor:pointer;");
      rect.setAttribute("pointer-events", "all");

      // 移除旧的事件监听器以防止重复绑定
      const oldClickHandler = rect._clickHandler;
      if (oldClickHandler) {
        rect.removeEventListener('click', oldClickHandler);
      }

      // 创建并存储新的事件处理函数
      const clickHandler = (event) => {
        event.stopPropagation();
        
        try {
          // 获取rect的父级g元素，可能包含data-cell-id等信息
          const parentG = rect.closest('g[data-cell-id]');
          const rectInfo = extractRectData(rect, parentG);

          console.log('rectInfo', rectInfo);
          
          // 设置选中的矩形
          setSelectedRect(rectInfo);
          
          // 调用外部传入的点击回调函数
          if (onRectClick && typeof onRectClick === 'function') {
            onRectClick(rectInfo);
          }
        } catch (error) {
          console.error('处理SVG元素点击时出错:', error);
        }
      };
      
      rect._clickHandler = clickHandler;
      rect.addEventListener('click', clickHandler);
    } catch (error) {
      console.error('添加点击处理器时出错:', error);
    }
  }, [extractRectData, onRectClick]);

  // 主要的事件监听器附加函数
  const attachEventListeners = useCallback((doc) => {
    if (!doc) return;
    
    try {
      const svg = doc.querySelector('svg');
      if (!svg) return;
      
      // 创建覆盖层
      createOverlay(doc, svg);
      
      // 查找所有rect元素，无论它们在哪个层级
      const rects = doc.querySelectorAll('rect:not([width="100%"][height="100%"][fill="transparent"])');
      
      // 为每个矩形添加点击事件
      rects.forEach(rect => {
        if (rect && rect.nodeType === 1) { // 确保是有效的元素节点
          addClickHandler(rect);
        }
      });
    } catch (error) {
      console.error('附加SVG事件监听器时出错:', error);
    }
  }, [createOverlay, addClickHandler]);

  // 当SVG文档加载或更新时重新绑定事件
  useEffect(() => {
    if (svgDoc) {
      attachEventListeners(svgDoc);
    }
    
    // 清理函数
    return () => {
      if (svgDoc) {
        const rects = svgDoc.querySelectorAll('rect');
        rects.forEach(rect => {
          if (rect._clickHandler) {
            rect.removeEventListener('click', rect._clickHandler);
          }
        });
      }
    };
  }, [svgDoc, attachEventListeners]);

  const handleSvgLoad = (e) => {
    try {
      const doc = e.target.contentDocument;
      if (doc) {
        setSvgDoc(doc);
      }
    } catch (error) {
      console.error('加载SVG文档时出错:', error);
    }
  };

  return {
    selectedRect,
    setSelectedRect,
    handleSvgLoad
  };
};

export default useSvgInteraction;