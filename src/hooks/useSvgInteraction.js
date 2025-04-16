import { useState, useEffect, useCallback } from 'react';

const useSvgInteraction = () => {
  const [selectedRect, setSelectedRect] = useState(null);
  const [svgDoc, setSvgDoc] = useState(null);

  // 创建透明覆盖层，阻止全局点击事件
  const createOverlay = useCallback((doc, svg) => {
    const overlay = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
    overlay.setAttribute("width", "100%");
    overlay.setAttribute("height", "100%");
    overlay.setAttribute("fill", "transparent");
    overlay.setAttribute("pointer-events", "all");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.zIndex = "999";
    
    if (svg.firstChild) {
      svg.insertBefore(overlay, svg.firstChild);
    } else {
      svg.appendChild(overlay);
    }
  }, []);

  // 从矩形元素提取文本内容
  const extractTextContent = useCallback((parentG) => {
    if (!parentG) return '';
    
    // 尝试从text元素获取
    const textElement = parentG.querySelector('text');
    if (textElement) {
      return textElement.textContent;
    }
    
    // 尝试从foreignObject中获取
    const foreignDiv = parentG.querySelector('foreignObject div div');
    if (foreignDiv) {
      return foreignDiv.textContent;
    }
    
    return '';
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
    // 设置rect元素的样式和zIndex，确保它们在覆盖层之上
    rect.style.position = "relative";
    rect.style.zIndex = "1000";
    rect.style.cursor = "pointer";
    rect.setAttribute("pointer-events", "all");
    
    // 移除旧的事件监听器以防止重复绑定
    const oldClickHandler = rect._clickHandler;
    if (oldClickHandler) {
      rect.removeEventListener('click', oldClickHandler);
    }
    
    // 创建并存储新的事件处理函数
    const clickHandler = (event) => {
      event.stopPropagation();
      
      // 获取rect的父级g元素，可能包含data-cell-id等信息
      const parentG = rect.closest('g[data-cell-id]');
      const rectInfo = extractRectData(rect, parentG);
      
      setSelectedRect(rectInfo);
    };
    
    rect._clickHandler = clickHandler;
    rect.addEventListener('click', clickHandler);
  }, [extractRectData]);

  // 主要的事件监听器附加函数
  const attachEventListeners = useCallback((doc) => {
    if (!doc) return;
    
    const svg = doc.querySelector('svg');
    if (!svg) return;
    
    // 创建覆盖层
    createOverlay(doc, svg);
    
    // 查找所有rect元素，无论它们在哪个层级
    const rects = doc.querySelectorAll('rect:not([width="100%"][height="100%"][fill="transparent"])');
    
    // 为每个矩形添加点击事件
    rects.forEach(rect => addClickHandler(rect));
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
    const doc = e.target.contentDocument;
    setSvgDoc(doc);
  };

  return {
    selectedRect,
    setSelectedRect,
    handleSvgLoad
  };
};

export default useSvgInteraction;