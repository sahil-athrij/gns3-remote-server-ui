import {EventEmitter, Injectable} from '@angular/core';

import {event, select} from 'd3-selection';
import {MapSettingsService} from '../../services/mapsettings.service';
import {ClickedDataEvent} from '../events/event-source';
import {NodeClicked, NodeContextMenu} from '../events/nodes';
import {NodesEventSource} from '../events/nodes-event-source';
import {GraphDataManager} from '../managers/graph-data-manager';
import {SelectionManager} from '../managers/selection-manager';
import {MapNode} from '../models/map/map-node';
import {SVGSelection} from '../models/types';
import {LabelWidget} from './label';
import {Widget} from './widget';

@Injectable()
export class NodeWidget implements Widget {
  public onContextMenu = new EventEmitter<NodeContextMenu>();
  public onNodeClicked = new EventEmitter<NodeClicked>();

  constructor(
    private graphDataManager: GraphDataManager,
    private selectionManager: SelectionManager,
    private labelWidget: LabelWidget,
    private nodesEventSource: NodesEventSource,
    private mapSettingsService: MapSettingsService
  ) {
  }

  public draw(view: SVGSelection) {
    const self = this;

    const node_body = view.selectAll<SVGGElement, MapNode>('g.node_body').data(n => [n]);

    const node_body_enter = node_body
      .enter()
      .append<SVGGElement>('g')
      .attr('class', 'node_body');

    node_body_enter.append<SVGImageElement>('image');

    const node_body_merge = node_body
      .merge(node_body_enter)
      .classed('selected', (n: MapNode) => this.selectionManager.isSelected(n))
      .on('click', (node: MapNode) => {
        this.nodesEventSource.clicked.emit(new ClickedDataEvent<MapNode>(node, event.pageX, event.pageY));
      });

    node_body_merge.select('.layer_label_wrapper').remove();
    if (this.mapSettingsService.isLayerNumberVisible) {
      node_body_merge
        .append<SVGRectElement>('rect')
        .attr('class', 'layer_label_wrapper')
        .attr('width', '26')
        .attr('height', '26')
        .attr('x', (n: MapNode) => n.width / 2 - 13)
        .attr('y', (n: MapNode) => n.height / 2 - 13)
        .attr('fill', 'red');
    }

    node_body_merge.select('.layer_label').remove();
    if (this.mapSettingsService.isLayerNumberVisible) {
      node_body_merge
        .append<SVGTextElement>('text')
        .attr('class', 'layer_label')
        .text((n: MapNode) => {
          return n.z;
        })
        .attr('x', (n: MapNode) => {
          if (n.z >= 100) {
            return n.width / 2 - 13;
          } else if (n.z >= 10) {
            return n.width / 2 - 9;
          } else {
            return n.width / 2 - 5;
          }
        })
        .attr('y', (n: MapNode) => n.height / 2 + 5)
        .attr('style', () => {
          const styles: string[] = [];
          styles.push(`font-family: "Noto Sans"`);
          styles.push(`font-size: 11pt`);
          styles.push(`font-weight: bold`);
          return styles.join('; ');
        })
        .attr('fill', `#ffffff`);
    }

    // update image of node
    node_body_merge
      .select<SVGImageElement>('image')
      .on('contextmenu', (n: MapNode, i: number) => {
        event.preventDefault();
        self.onContextMenu.emit(new NodeContextMenu(event, n));
      })
      .attr('xnode:href', (n: MapNode) => n.symbolUrl)
      .attr('width', (n: MapNode) => {
        if (!n.width) { return 60; }
        return n.width;
      })
      .attr('height', (n: MapNode) => {
        if (!n.height) {
          return 60;
        }
        return n.height;
      })
      .attr('x', (n: MapNode) => {
        if (n.symbolUrl.includes('circle')) {
          return 0;
        }
        return -30;
      })
      .attr('y', (n: MapNode) => {
        if (n.symbolUrl.includes('circle')) {
          return 0;
        }
        return -30;
      })
      .on('mouseover', function (this, n: MapNode) {
        select(this).attr('class', 'over');
      })
      .on('mouseout', function (this, n: MapNode) {
        select(this).attr('class', '');
      });

    node_body_merge.attr('transform', (n: MapNode) => {
      return `translate(${n.x},${n.y})`;
    });

    this.labelWidget.draw(node_body_merge);
  }
}
