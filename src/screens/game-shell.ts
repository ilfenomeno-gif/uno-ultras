export interface GameShellOptions {
  boardClass?: string;
  title?: string;
  subtitle?: string;
  topSlot?: string;
  leftSlot?: string;
  rightSlot?: string;
  centerContent: string;
  bottomContent?: string;
  bottomSideContent?: string;
  actionBar?: string;
  overlay?: string;
}

export function renderGameShell(options: GameShellOptions): string {
  const {
    boardClass = '',
    title,
    subtitle,
    topSlot,
    leftSlot,
    rightSlot,
    centerContent,
    bottomContent,
    bottomSideContent,
    actionBar,
    overlay
  } = options;

  const sideClass = `${leftSlot ? 'has-left' : 'no-left'} ${rightSlot ? 'has-right' : 'no-right'}`;

  return `
    <div class="fn-board fn-board-shell ${boardClass}">
      <div class="fn-board-shell-top">
        <div class="fn-board-shell-title">
          ${title ? `<h2>${title}</h2>` : ''}
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        ${topSlot ? `<div class="fn-board-shell-top-slot">${topSlot}</div>` : ''}
      </div>

      <div class="fn-board-shell-middle ${sideClass}">
        ${leftSlot ? `<aside class="fn-board-shell-side left">${leftSlot}</aside>` : '<aside class="fn-board-shell-side left empty"></aside>'}

        <div class="fn-board-shell-center">${centerContent}</div>

        ${rightSlot ? `<aside class="fn-board-shell-side right">${rightSlot}</aside>` : '<aside class="fn-board-shell-side right empty"></aside>'}
      </div>

      ${
        bottomContent || bottomSideContent
          ? `<div class="fn-board-shell-bottom">
               <div class="fn-board-shell-bottom-main">${bottomContent ?? ''}</div>
               ${bottomSideContent ? `<aside class="fn-board-shell-bottom-side">${bottomSideContent}</aside>` : ''}
             </div>`
          : ''
      }

      ${actionBar ? `<div class="fn-board-shell-actions">${actionBar}</div>` : ''}
      ${overlay ?? ''}
    </div>
  `;
}
