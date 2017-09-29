import PropTypes from 'prop-types';
import React from 'react';
import Faux from 'react-faux-dom';
import d3 from 'd3';

/* eslint react/prefer-es6-class:0 no-tabs:0 */
/* eslint no-return-assign:0 */

const D3Tree = React.createClass({

  propTypes: {
    data: PropTypes.array.isRequired,
  },

  mixins: [Faux.mixins.core, Faux.mixins.anim],

  getInitialState() {
    return { tree: false };
  },

  componentDidMount() {
    const totalWidth = 1200;
    const totalHeight = 900;
    const margin = { top: 20, right: 80, bottom: 20, left: 150 };
    const	width = totalWidth - margin.right - margin.left;
    const height = totalHeight - margin.top - margin.bottom;

    let i = 0;
    const	duration = 750;

    const tree = d3.layout.tree()
      .size([height, width]);

    const diagonal = d3.svg.diagonal()
      .projection(d => [d.y, d.x]);

    const faux = this.connectFauxDOM('div', 'tree');

    const svg = d3.select(faux).append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const { data } = this.props;
    const root = data[0];
    root.x0 = height / 2;
    root.y0 = 0;

    d3.select(self.frameElement).style('height', '500px');

    const update = (source) => {
      /* eslint no-use-before-define:0 */

      // Compute the new tree layout.
      const nodes = tree(root).reverse();
      const links = tree.links(nodes);

      const maxNodes = (ary, depth = 0) =>
        ary.map((item) => {
          if (item.children) {
            return maxNodes(item.children, depth + 1);
          }
          return depth;
        });

      const flatten = list =>
        list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

      const maxDepth = flatten(maxNodes(data)).reduce((pv, cv) => (pv > cv ? pv : cv), 0);

      // Normalize for fixed-depth.
      const deep = width / (maxDepth * 1.5);
      nodes.forEach(d => (d.y = d.depth * deep));

      // Update the nodes…
      const node = svg.selectAll('g.node')
        .data(nodes, d => (d.id || (d.id = ++i)));

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', () => `translate(${source.y0}, ${source.x0})`)
        .on('click', (d) => {
          click(d);
        });

      const addClasses = (d) => {
        let value = '';
        if (d._children) {
          value += 'circle-active';
          value += ' clickable';
        } else {
          value += 'circle-inactive';
        }
        if (d.children) {
          value += ' clickable';
        } else {
          value += ' not-clickable';
        }
        return value;
      };

      nodeEnter.append('circle')
        .attr('r', 1e-6)
        .attr('class', addClasses);

      nodeEnter.append('text')
        .attr('x', d => (d.children || d._children ? -13 : 13))
        .attr('dy', '.35em')
        .attr('text-anchor', d => (d.children || d._children ? 'end' : 'start'))
        .text(d => d.name)
        .attr('class', 'svg-text')
        .style('fill-opacity', 1e-6);

      // Transition nodes to their new position.
      const nodeUpdate = node.transition()
        .duration(duration)
        .attr('transform', d => `translate(${d.y}, ${d.x})`);

      nodeUpdate.select('circle')
        .attr('r', 10)
        .attr('class', addClasses);

      nodeUpdate.select('text')
        .style('fill-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', () => `translate(${source.y}, ${source.x})`)
        .remove();

      nodeExit.select('circle')
        .attr('r', 1e-6);

      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // Update the links…
      const link = svg.selectAll('path.link')
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', () => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      this.animateFauxDOM(duration + 300);

    };

    update(root);

    // Toggle children on click.
    const click = (d) => {
      /* eslint no-underscore-dangle:0 */
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    };

    this.animateFauxDOM(duration + 1300);
  },

  render() {
    return (
      <div className="row">
        <div>
          <div className="d3">
            {this.state.tree}
          </div>
        </div>
      </div>
    );
  },

});

export default D3Tree;
