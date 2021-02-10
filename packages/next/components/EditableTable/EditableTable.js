import React from 'react';

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    //  this.state.products = [];
    this.state = {};
    this.state.filterText = '';
    this.state.products = props.data;
    this.state.columns = props.columns;
  }
  handleUserInput(filterText) {
    this.setState({ filterText: filterText });
  }
  handleRowDel(product) {
    var index = this.state.products.indexOf(product);
    const products = [...this.state.products];
    products.splice(index, 1);
    this.props.onChange(products);
    this.setState({ products });
  }

  handleAddEvent(evt) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var product = {
      id: id,
    };
    this.state.columns.forEach((col) => {
      product[col.name] = '';
    });
    const products = [...this.state.products];
    products.push(product);
    this.props.onChange(products);
    this.setState({ products });
  }

  handleProductTable(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
    };
    var products = [...this.state.products];
    var newProducts = products.map(function (product) {
      for (var key in product) {
        if (key == item.name && product.id == item.id) {
          product[key] = item.value;
        }
      }
      return product;
    });
    this.props.onChange(newProducts);
    this.setState({ products: newProducts });
    // console.log('CH', newProducts);
  }
  render() {
    return (
      <div>
        {/*<SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)} />*/}
        <EditableTableInner
          onProductTableUpdate={this.handleProductTable.bind(this)}
          onRowAdd={this.handleAddEvent.bind(this)}
          onRowDel={this.handleRowDel.bind(this)}
          products={this.state.products}
          columns={this.state.columns}
          filterText={this.state.filterText}
        />
      </div>
    );
  }
}
class SearchBar extends React.Component {
  handleChange() {
    this.props.onUserInput(this.refs.filterTextInput.value);
  }
  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

class EditableTableInner extends React.Component {
  render() {
    var onProductTableUpdate = this.props.onProductTableUpdate;
    var rowDel = this.props.onRowDel;
    var filterText = this.props.filterText;
    var { columns } = this.props;
    var rows = this.props.products.map(function (product) {
      /*if (product.name.indexOf(filterText) === -1) {
          return;
      }*/
      return (
        <TableRow
          onProductTableUpdate={onProductTableUpdate}
          product={product}
          onDelEvent={rowDel.bind(this)}
          columns={columns}
          key={product.id}
        />
      );
    });
    return (
      <div>
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.name}>{col.label || col.name}</th>
              ))}
              <th>
                <button
                  type="button"
                  onClick={this.props.onRowAdd}
                  className="btn btn-success pull-right"
                >
                  Add
                                </button>
              </th>
            </tr>
          </thead>

          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

class TableRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.product);
  }
  render() {
    const { columns } = this.props;
    return (
      <tr className="eachRow">
        {columns.map((col) => (
          <EditableCell
            key={col.name}
            onProductTableUpdate={this.props.onProductTableUpdate}
            cellData={{
              key: col.name,
              type: col.name,
              value: this.props.product[col.name],
              id: this.props.product.id,
            }}
          />
        ))}
        <td className="del-cell">
          <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn" />
        </td>
      </tr>
    );
  }
}
class EditableCell extends React.Component {
  render() {
    return (
      <td>
        <input
          type="text"
          name={this.props.cellData.type}
          id={this.props.cellData.id}
          value={this.props.cellData.value}
          onChange={this.props.onProductTableUpdate}
        />
      </td>
    );
  }
}
export { EditableTable };
