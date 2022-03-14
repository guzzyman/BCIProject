import clsx from "clsx";
import LoadingContent from "./LoadingContent";
import TablePagination from "./TablePagination";
import "./StandardTable.css";
import TableEmptyContent from "./TableEmptyContent";

/**
 * @param {StandardTableProps} props
 */
function StandardTable(props) {
  const {
    instance,
    className,
    component,
    loading,
    error,
    onMount,
    onReload,
    renderBody,
    renderHeader,
    renderFooter,
  } = props;
  const { getTableProps } = instance;

  const Root = component;

  return (
    <Root {...getTableProps({ className: clsx("StandardTable", className) })}>
      {renderHeader?.(instance, props)}
      <LoadingContent
        loading={loading}
        error={error}
        onMount={onMount}
        onReload={onReload}
      >
        {() => renderBody?.(instance, props)}
      </LoadingContent>
      {renderFooter?.(instance, props)}
    </Root>
  );
}

/**
 * @type {StandardTableProps}
 */
StandardTable.defaultProps = {
  component: "div",
  RowComponent: "div",
  renderHeader,
  renderHeaderGroup,
  renderHeaderCell,
  renderBody,
  renderRow,
  renderCell,
  renderFooter,
  renderPagination,
  renderEmptyContent,
};

export default StandardTable;

function renderHeader(instance, props) {
  return (
    <div className="StandardTable__header">
      {instance.headerGroups.map((headerGroup) =>
        props?.renderHeaderGroup?.(headerGroup, instance, props)
      )}
    </div>
  );
}

function renderHeaderGroup(headerGroup, instance, props) {
  return (
    <div
      {...headerGroup.getHeaderGroupProps({
        style: {
          width: instance.totalColumnsWidth,
          minWidth: "100%",
        },
        className: clsx("StandardTable__row StandardTable__header__row"),
      })}
    >
      {headerGroup.headers.map((header) =>
        props?.renderHeaderCell?.(header, instance, props)
      )}
    </div>
  );
}

function renderHeaderCell(header) {
  return (
    <div
      {...header.getHeaderProps({
        className: clsx("StandardTable__cell StandardTable__header__row__cell"),
      })}
    >
      {header.render("Header")}
    </div>
  );
}

function renderBody(instance, props) {
  const rows = instance.disablePagination
    ? instance.rows
    : instance.page || instance.rows;

  return rows.length ? (
    <div
      {...instance.getTableBodyProps({
        className: clsx("StandardTable__body"),
      })}
    >
      {rows.map((row) => {
        instance.prepareRow(row);
        return props?.renderRow?.(row, instance, props);
      })}
    </div>
  ) : (
    props?.renderEmptyContent?.(instance, props)
  );
}

function renderRow(row, instance, props) {
  const rowProps =
    typeof props?.rowProps === "function"
      ? props?.rowProps(row, instance, props)
      : props.rowProps;

  const Component = props.RowComponent;

  return (
    <Component
      {...row.getRowProps({
        ...rowProps,
        style: {
          width: instance.totalColumnsWidth,
          minWidth: "100%",
          ...rowProps?.style,
        },
        className: clsx(
          "StandardTable__row StandardTable__body__row",
          rowProps?.className
        ),
      })}
    >
      {row.cells.map((cell) => {
        return props.renderCell?.(cell, instance, props);
      })}
    </Component>
  );
}

function renderCell(cell) {
  return (
    <div
      {...cell.getCellProps({
        className: clsx("StandardTable__cell StandardTable__body__row__cell"),
      })}
    >
      {cell.render("Cell")}
    </div>
  );
}

function renderFooter(instance, props) {
  return (
    <div className="StandardTable__footer">
      {props?.renderPagination?.(instance, props)}
    </div>
  );
}

function renderPagination(instance) {
  if (instance.disablePagination) {
    return null;
  }
  return (
    <TablePagination
      className="StandardTable__footer__pagination"
      instance={instance}
    />
  );
}

function renderEmptyContent() {
  return <TableEmptyContent />;
}

/**
 * @typedef {import("react-table").TableInstance} TableInstance
 */

/**
 * @typedef {{
 * instance: TableInstance;
 * renderHeader: (instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderHeaderGroup: (headerGroup: import("react-table").HeaderGroup<any>, instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderHeaderCell: (header: import("react-table").HeaderGroup<any>, instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderBody: (instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderRow: (row: import("react-table").Row<any>, instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderCell: (cell: import("react-table").Cell<any, any>, instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderFooter: (instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderPagination: (instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * renderEmptyContent: (instance: TableInstance, props: StandardTableProps) => import("react").ReactNode;
 * rowProps: ((row: import("react-table").Row<any>, instance: TableInstance, props: StandardTableProps) =>  any ) | {};
 * RowComponent: any;
 * } & import("./LoadingContent").LoadingContentProps} StandardTableProps
 */
