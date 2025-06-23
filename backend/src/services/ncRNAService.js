import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../../data');
const GENE_NCRNA_MAP_FILE = path.join(DATA_DIR, 'gene_ncRNA_map.json');

let geneNcRNAMap = null;

// 初始化数据
async function initializeData() {
  try {
    if (!fs.existsSync(GENE_NCRNA_MAP_FILE)) {
      console.warn('ncRNA数据文件不存在，请先运行数据下载脚本');
      return false;
    }

    const data = fs.readFileSync(GENE_NCRNA_MAP_FILE, 'utf8');
    geneNcRNAMap = JSON.parse(data);
    console.log(`已加载 ${Object.keys(geneNcRNAMap).length} 个基因的ncRNA数据`);
    return true;
  } catch (error) {
    console.error('初始化ncRNA数据失败:', error);
    return false;
  }
}

// 查询基因相关的ncRNA
export async function queryNcRNA(gene, type) {
  // 如果数据未初始化，尝试初始化
  if (!geneNcRNAMap) {
    const initialized = await initializeData();
    if (!initialized) {
      throw new Error('ncRNA数据未初始化');
    }
  }

  const geneData = geneNcRNAMap[gene];
  if (!geneData) {
    return [];
  }

  let results = [];

  if (type === 'all') {
    // 返回所有类型的ncRNA
    ['miRNA', 'lncRNA', 'circRNA'].forEach(ncType => {
      if (geneData[ncType]) {
        results = results.concat(geneData[ncType]);
      }
    });
  } else {
    // 返回指定类型的ncRNA
    if (geneData[type]) {
      results = geneData[type];
    }
  }

  return results;
}

// 获取数据库统计信息
export async function getDataStats() {
  if (!geneNcRNAMap) {
    const initialized = await initializeData();
    if (!initialized) {
      throw new Error('ncRNA数据未初始化');
    }
  }

  const stats = {
    totalGenes: Object.keys(geneNcRNAMap).length,
    miRNACount: 0,
    lncRNACount: 0,
    circRNACount: 0
  };

  Object.values(geneNcRNAMap).forEach(geneData => {
    if (geneData.miRNA) stats.miRNACount += geneData.miRNA.length;
    if (geneData.lncRNA) stats.lncRNACount += geneData.lncRNA.length;
    if (geneData.circRNA) stats.circRNACount += geneData.circRNA.length;
  });

  return stats;
}

// 启动时初始化数据
initializeData();
