import React from "react";
import { useVirtual } from "react-virtual";
import { useDraggable } from "react-use-draggable-scroll";

export default function App() {
  const cells = new Array(50).fill(true).map((_, i) =>
    new Array(50).fill(true).map((_, j) => ({
      // these dimensions are to simulate content blocks of
      // varying dimensions. in a real version the content
      // of the cell will determine the dimensions
      height: 50 + Math.random() * 2 * j,
      width: 100 + Math.random() * 2 * i
    }))
  );

  return <GridVirtualizerDynamic cells={cells} />;
}

function GridVirtualizerDynamic({ cells }) {
  const parentRef = React.useRef();

  const { events } = useDraggable(parentRef);

  const rowVirtualizer = useVirtual({
    size: cells.length,
    parentRef
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: cells[0].length,
    parentRef
  });

  return (
    <>
      <div
        {...events}
        ref={parentRef}
        className="List"
        style={{
          height: `400px`,
          width: `500px`,
          overflow: "auto"
        }}
      >
        <div
          style={{
            height: rowVirtualizer.totalSize,
            width: columnVirtualizer.totalSize,
            position: "relative"
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <React.Fragment key={virtualRow.key}>
              {columnVirtualizer.virtualItems.map((virtualColumn, x) => (
                <div
                  key={virtualColumn.key}
                  ref={(el) => {
                    if (el) {
                      let cell = cells[virtualRow.index][virtualColumn.index];

                      cell.measured = el.getBoundingClientRect();

                      let maxHeight = Math.max(
                        ...cells[virtualRow.index]
                          .map((c) => c.measured?.height)
                          .filter(Boolean)
                      );
                      let maxWidth = Math.max(
                        ...cells
                          .map(
                            (cell) => cell[virtualColumn.index].measured?.width
                          )
                          .filter(Boolean)
                      );
                      virtualRow.measureRef({
                        offsetHeight: maxHeight
                      });
                      virtualColumn.measureRef({
                        offsetWidth: maxWidth
                      });
                    }
                  }}
                  style={{
                    border: "1px dashed silver",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
                  }}
                >
                  <div
                    style={{
                      height:
                        cells[virtualRow.index][virtualColumn.index].height,
                      width: cells[virtualRow.index][virtualColumn.index].width
                    }}
                  >
                    Cell {virtualRow.index}, {virtualColumn.index}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
