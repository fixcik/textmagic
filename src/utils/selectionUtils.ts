/**
 * Вычисляет позицию для отображения кнопки улучшения текста
 */
export interface ButtonPosition {
  x: number;
  y: number;
  placement: 'top' | 'bottom';
}

/**
 * Вычисляет позицию для отображения кнопки улучшения, основываясь на позиции элемента ввода
 */
export const calculateButtonPosition = (element: HTMLElement): ButtonPosition => {
  // Получаем размеры и положение активного элемента
  const elementRect = element.getBoundingClientRect();

  // Получаем размеры окна просмотра
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Определяем, достаточно ли места сверху и снизу от элемента
  const spaceAbove = elementRect.top;
  const spaceBelow = viewportHeight - (elementRect.top + elementRect.height);

  // Минимальное пространство, необходимое для отображения кнопок (с запасом)
  const minRequiredSpace = 60;

  // Рассчитываем X-координату (по центру элемента)
  let posX = elementRect.left + (elementRect.width / 2);

  // Ограничиваем X, чтобы кнопка не выходила за края экрана
  // Предполагаем, что ширина кнопок примерно 100px
  const buttonWidth = 100;
  posX = Math.max(buttonWidth / 2, Math.min(posX, viewportWidth - buttonWidth / 2));

  // Определяем Y-координату в зависимости от доступного пространства
  let posY: number;
  let placement: 'top' | 'bottom' = 'top'; // по умолчанию сверху, если есть место

  if (spaceAbove >= minRequiredSpace && spaceAbove >= spaceBelow) {
    // Размещаем над элементом, если достаточно места сверху
    posY = elementRect.top - minRequiredSpace;
    placement = 'top';
  } else if (spaceBelow >= minRequiredSpace) {
    // Размещаем под элементом, если достаточно места снизу
    posY = elementRect.bottom + 10; // небольшой отступ от элемента
    placement = 'bottom';
  } else {
    // Если нет места ни сверху, ни снизу, размещаем кнопки в видимой области
    // Выбираем область с наибольшим пространством
    if (spaceAbove >= spaceBelow) {
      posY = elementRect.top - Math.min(spaceAbove, minRequiredSpace) + 10;
      placement = 'top';
    } else {
      posY = elementRect.bottom + 10;
      placement = 'bottom';
    }
  }

  return {
    x: posX,
    y: posY,
    placement
  };
}; 