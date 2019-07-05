import multihashes from 'multihashes'
import TitleMixinProto from './protobuf/TitleMixin_pb.js'
import ImageMixinProto from './protobuf/ImageMixin_pb.js'
import BodyTextMixinProto from './protobuf/BodyTextMixin_pb.js'
import MixinSchemaMixinProto from './protobuf/MixinSchemaMixin_pb.js'
import ProfileMixinProto from './protobuf/ProfileMixin_pb.js'
import FileMixinProto from './protobuf/FileMixin_pb.js'
import MixContent from './MixContent.js'
import File from './File.js'
import Base58 from 'base-58'

export default class MixRevision {

  constructor(vue, item, revisionId) {
    this.vue = vue
    this.item = item
    this.revisionId = revisionId
  }

  async load() {
    this.content = new MixContent(this.vue)
    await this.content.load(this.item.item.ipfsHashes[this.revisionId])
    return this
  }

  getTimestamp() {
    return this.item.item.timestamps[this.revisionId]
  }

  getTitle() {
    return TitleMixinProto.TitleMixin.deserializeBinary(this.content.getPayloads('0x24da6114')[0]).getTitle()
  }

  getImage(widthMin, heightMin) {
    let imageMessage = new ImageMixinProto.ImageMixin.deserializeBinary(this.content.getPayloads('0x12745469')[0])
    let width = imageMessage.getWidth()
    let height = imageMessage.getHeight()
    let mipmapList = imageMessage.getMipmapLevelList()

    let i, scale
    for (i = 0; i < mipmapList.length; i++) {
      scale = 2 ** i
      if (width / scale < widthMin * 4 || height / scale < heightMin * 4) {
        break
      }
    }

    let widthOut = Math.round(width / scale)
    let heightOut = Math.round(height / scale)
    return '<img src="http://127.0.0.1:5102/ipfs/' + Base58.encode(mipmapList[i].getIpfsHash()) + '" width="' + widthOut + '" height="' + heightOut + '">'
  }

  getFile() {
    let fileMessage = FileMixinProto.FileMixin.deserializeBinary(this.content.getPayloads('0x0b62637e')[0])
    return {
      name: fileMessage.getFilename(),
      size: fileMessage.getFilesize(),
      hash: Base58.encode(fileMessage.getIpfsHash()),
    }
  }

  getBodyText() {
    return BodyTextProto.BodyTextMixin.deserializeBinary(this.content.getPayloads('0x34a9a6ec')[0]).getBodyText()
  }

  getMixinSchema() {
    return MixinSchemaMixinProto.MixinSchemaMixin.deserializeBinary(this.content.getPayloads('0x5a474550')[0]).getMixinSchema()
  }

  getProfile() {
    let profileMessage = ProfileMixin.ProfileMixin.deserializeBinary(this.content.getPayloads('0x4bf3ce07')[0])
    return {
      type: profileMessage.getType(),
      location: profileMessage.getLocation(),
    }
  }

}
